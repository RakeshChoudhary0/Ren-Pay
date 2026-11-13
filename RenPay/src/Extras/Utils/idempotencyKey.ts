const generateIdempotencyKey = (userId: string, receiver_id: string) => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 10); // 8-char random string

  return `IDEMP_U${userId}_${'TO'}_${receiver_id}_${timestamp}_${randomSuffix}`;
};

export default generateIdempotencyKey;
