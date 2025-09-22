export interface NPIProfile {
  npi: string;
  formattedName: string;
  addrLine1: string;
  addrLine2?: string;
  addrLine3?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  specialty: string;
  profileStatus: string;
  licenseState: string;
  licenseType: string;
  licenseNumber: string;
  licenseStatus: string;
  licenseStartDate?: string;
  licenseExpirationDate?: string;
}

export const npiProfiles: Record<string, NPIProfile> = {
  "1164037024": {
    npi: "1164037024",
    formattedName: "Aminata Aw",
    addrLine1: "214 E 23rd St",
    addrLine2: "",
    addrLine3: "",
    city: "Cheyenne",
    state: "WY",
    zipCode: "82001",
    country: "United States",
    specialty: "Doctor of Medicine",
    profileStatus: "Active",
    licenseState: "WY",
    licenseType: "RN",
    licenseNumber: "46048",
    licenseStatus: "A",
    licenseStartDate: "",
    licenseExpirationDate: ""
  },
  "1356035752": {
    npi: "1356035752",
    formattedName: "DENA KENDRICK LOWE",
    addrLine1:"2309 E Main St",
    addrLine2: "",
    addrLine3: "",
    city: "New Iberia",
    state: "LA",
    zipCode: "70560",
    country: "United States",
    specialty: "Nurse Practitioner",
    profileStatus: "Active",
    licenseState: "LA",
    licenseType: "RN",
    licenseNumber: "112760",
    licenseStatus: "A",
    licenseStartDate: "2005-07-18",
    licenseExpirationDate: "2026-01-31"
  },
  "1780827816": {
    npi: "1780827816",
    formattedName: "Jessy Pattaniyil",
    addrLine1:"3223 N Broad St",
    addrLine2: "",
    addrLine3: "",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19140",
    country: "United States",
    specialty: "Nurse Practitioner",
    profileStatus: "Active",
    licenseState: "",
    licenseType: "",
    licenseNumber: "",
    licenseStatus: "A",
    licenseStartDate: "",
    licenseExpirationDate: ""
  }
};

export const getNPIProfile = (npi: string): NPIProfile | null => {
  return npiProfiles[npi] || null;
};