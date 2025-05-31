import { apiRoutes } from "@/constants/apiRoutes";
import type { Manager, ManagerCreationDto } from "@/types/manager"
import { post } from "./apiClient";

export const hasEmptyKey = (obj: ManagerCreationDto | Manager): boolean => {
  for (const key in obj) {
    if (!key || key === "") {
      return true
    }
  }
  return false
}
export const sendEmail = async (
  data: { subject: string; message: string },
  investorId?: number
): Promise<void> => {
  try {
    const endpoint = investorId 
      ? apiRoutes.email.sendToInvestor(investorId) 
      : apiRoutes.email.send();
    
    await post(endpoint, { data });
    alert('Email sent successfully!');
  } catch (error) {
    console.error("Email send failed:", error);
    alert('Failed to send email. Please try again later.');
  }
};