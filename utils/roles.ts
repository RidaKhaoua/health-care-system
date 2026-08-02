export async function getRoles() {
  const { sessionClaims } = await auth();
  const role =sessionClaims?.metadata?.role!?.toLowerCase() || Role.PATIENT.toLocaleLowerCase();

  return role;
}
