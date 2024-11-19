export const responseHandler = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error);
  }
  return res.json();
}