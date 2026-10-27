// In-memory seat lock storage
// Key: showId -> Object: { [seatId]: { userId, expiresAt, timeoutId } }
const locks = new Map();

const LOCK_DURATION_MS = 8 * 60 * 1000; // 8 minutes lock window

const getLockedSeats = (showId) => {
  const showLocks = locks.get(String(showId));
  if (!showLocks) return [];

  const now = Date.now();
  const validSeats = [];

  for (const [seatId, info] of Object.entries(showLocks)) {
    if (info.expiresAt > now) {
      validSeats.push({ seatId, userId: info.userId, expiresAt: info.expiresAt });
    } else {
      delete showLocks[seatId];
    }
  }

  return validSeats;
};

const isSeatLockedByOther = (showId, seatId, userId) => {
  const showLocks = locks.get(String(showId));
  if (!showLocks || !showLocks[seatId]) return false;

  const info = showLocks[seatId];
  if (info.expiresAt <= Date.now()) {
    delete showLocks[seatId];
    return false;
  }

  return String(info.userId) !== String(userId);
};

const lockSeats = (showId, seatIds, userId, io = null) => {
  const sId = String(showId);
  if (!locks.has(sId)) {
    locks.set(sId, {});
  }

  const showLocks = locks.get(sId);
  const now = Date.now();
  const expiresAt = now + LOCK_DURATION_MS;

  // Check if any seat is already locked by someone else
  for (const seatId of seatIds) {
    if (showLocks[seatId] && showLocks[seatId].expiresAt > now && String(showLocks[seatId].userId) !== String(userId)) {
      return {
        success: false,
        message: `Seat ${seatId} is temporarily reserved by another customer.`
      };
    }
  }

  // Lock seats
  for (const seatId of seatIds) {
    if (showLocks[seatId] && showLocks[seatId].timeoutId) {
      clearTimeout(showLocks[seatId].timeoutId);
    }

    const timeoutId = setTimeout(() => {
      unlockSeats(showId, [seatId], userId, io);
    }, LOCK_DURATION_MS);

    showLocks[seatId] = {
      userId: String(userId),
      expiresAt,
      timeoutId
    };
  }

  if (io) {
    io.to(`show_${sId}`).emit('seatStatusChanged', {
      showId: sId,
      lockedSeats: getLockedSeats(sId)
    });
  }

  return { success: true, expiresAt };
};

const unlockSeats = (showId, seatIds, userId, io = null) => {
  const sId = String(showId);
  const showLocks = locks.get(sId);
  if (!showLocks) return;

  for (const seatId of seatIds) {
    if (showLocks[seatId] && (String(showLocks[seatId].userId) === String(userId) || userId === 'SYSTEM')) {
      if (showLocks[seatId].timeoutId) {
        clearTimeout(showLocks[seatId].timeoutId);
      }
      delete showLocks[seatId];
    }
  }

  if (io) {
    io.to(`show_${sId}`).emit('seatStatusChanged', {
      showId: sId,
      lockedSeats: getLockedSeats(sId)
    });
  }
};

module.exports = {
  getLockedSeats,
  isSeatLockedByOther,
  lockSeats,
  unlockSeats
};

