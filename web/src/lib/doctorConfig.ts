/**
 * Hardcoded doctor credentials.
 * In production, this would be managed through an admin panel.
 * To add a new doctor, add their entry to the APPROVED_DOCTORS array.
 */

export interface DoctorCredential {
  email: string;
  password: string;
  displayName: string;
}

export const APPROVED_DOCTORS: DoctorCredential[] = [
  {
    email: "darshannayak085@gmail.com",
    password: "Darshan@992007",
    displayName: "Vinayak",
  },
];

/**
 * Check if an email belongs to an approved doctor.
 */
export function isApprovedDoctor(email: string): boolean {
  return APPROVED_DOCTORS.some(
    (d) => d.email.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Get doctor credentials by email.
 */
export function getDoctorByEmail(
  email: string
): DoctorCredential | undefined {
  return APPROVED_DOCTORS.find(
    (d) => d.email.toLowerCase() === email.toLowerCase()
  );
}
