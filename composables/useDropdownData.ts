import dropdownsData from "~/data/interchanges.json";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownConfig {
  id: string;
  label: string;
  placeholder: string;
  options: DropdownOption[];
}

export interface Section {
  id: number;
  title: string;
  dropdowns: DropdownConfig[];
}

export interface ColorConfig {
  section: number;
  bgColor: string;
  textColor: string;
  bgLight: string;
}

export interface DropdownsData {
  sections: Section[];
  colors: ColorConfig[];
}

export const useDropdownData = () => {
  const data = dropdownsData as DropdownsData;

  // Obtener todas las secciones
  const getSections = (): Section[] => {
    return data.sections;
  };

  // Obtener sección específica
  const getSection = (sectionId: number): Section | undefined => {
    return data.sections.find((section) => section.id === sectionId);
  };

  // Obtener dropdowns de una sección
  const getDropdowns = (sectionId: number): DropdownConfig[] => {
    const section = getSection(sectionId);
    return section ? section.dropdowns : [];
  };

  // Obtener configuración de colores por sección
  const getColorConfig = (sectionId: number): ColorConfig | undefined => {
    return data.colors.find((color) => color.section === sectionId);
  };

  // Obtener todas las configuraciones de colores
  const getAllColorConfigs = (): ColorConfig[] => {
    return data.colres;
  };

  // Buscar opción por valor
  const findOptionByValue = (
    sectionId: number,
    dropdownId: string,
    value: string
  ): DropdownOption | undefined => {
    const section = getSection(sectionId);
    if (!section) return undefined;

    const dropdown = section.dropdowns.find((d) => d.id === dropdownId);
    if (!dropdown) return undefined;

    return dropdown.options.find((option) => option.value === value);
  };

  // Obtener todas las opciones de un dropdown
  const getOptions = (
    sectionId: number,
    dropdownId: string
  ): DropdownOption[] => {
    const dropdown = getDropdowns(sectionId).find((d) => d.id === dropdownId);
    return dropdown ? dropdown.options : [];
  };

  // Verificar si existe una opción
  const hasOption = (
    sectionId: number,
    dropdownId: string,
    value: string
  ): boolean => {
    return !!findOptionByValue(sectionId, dropdownId, value);
  };

  return {
    data,
    getSections,
    getSection,
    getDropdowns,
    getColorConfig,
    getAllColorConfigs,
    findOptionByValue,
    getOptions,
    hasOption,
  };
};
