export interface CorrectorValues {
    bone: number
    organ: number
  }
  
  export interface BoneCorrectorValues {
    meat: number
    organ: number
  }
  
  export interface OrganCorrectorValues {
    meat: number
    bone: number
  }
  
  export interface RatioValues {
    meat: number
    bone: number
    organ: number
    selectedRatio: string
    isUserDefined?: boolean
    isTemporary?: boolean
  }
  
  export type RatioType = "80:10:10" | "75:15:10" | "custom"
  