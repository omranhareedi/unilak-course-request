let io = null;

export const setIO = (socketIO) => { io = socketIO; };

export const broadcast = (departmentId, campusId) => {
  if (!io) return;
  if (departmentId) io.to(`dept-${departmentId}`).emit('queue-update', { departmentId });
  if (campusId) io.to(`campus-${campusId}`).emit('display-update', { campusId });
};
