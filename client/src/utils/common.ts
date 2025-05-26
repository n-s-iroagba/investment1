import type { Manager, ManagerCreationDto } from "@/types/manager"

export const hasEmptyKey = (obj: ManagerCreationDto | Manager): boolean => {
  for (const key in obj) {
    if (!key || key === "") {
      return true
    }
  }
  return false
}
