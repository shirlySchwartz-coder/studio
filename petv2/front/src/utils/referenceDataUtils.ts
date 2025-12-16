// src/utils/referenceDataUtils.ts
// פונקציות עזר לניהול referenceData – ניקוי, שמירה, טעינה (נתונים סטטיים כמו גודל, מין, סוג חיה)

/**
 * שמירת referenceData ב-localStorage בצורה נקייה (JSON תקין)
 * @param data - האובייקט המלא מה-API
 */
export const saveReferenceData = (data: any): void => {
  try {
    const cleanData = {
      sizes:
        data.sizes?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      genders:
        data.genders?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      species:
        data.species?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      statuses:
        data.statuses?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      shelters:
        data.shelters?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      breeds:
        data.breeds?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      cities:
        data.cities?.map((item: any) => ({ id: item.id, name: item.name })) ||
        [],
      filterOptions:
        data.filterOptions?.map((item: any) => ({
          id: item.id,
          category: item.category,
          name: item.name,
          description: item.description,
          display_order: item.display_order,
        })) || [],
    };
    localStorage.setItem('referenceData', JSON.stringify(cleanData));
    console.log('✅ referenceData נשמרה ב-localStorage:', cleanData);
  } catch (error) {
    console.error('שגיאה בשמירת referenceData:', error);
  }
};

/**
 * טעינת referenceData מ-localStorage – מנקה ומחזירה מערכים תקינים
 * @returns {ReferenceData} – אוביProjects
 יקט נקי עם מערכים
 */
export const loadReferenceData = (): any => {
  try {
    const stored = localStorage.getItem('referenceData');
    if (!stored)
      return {
        sizes: [],
        genders: [],
        species: [],
        statuses: [],
        shelters: [],
        breeds: [],
        cities: [],
        filterOptions: [],
      };

    const parsed = JSON.parse(stored);
    // ניקוי: מסננים undefined/ריק
    const clean = {
      sizes: (parsed.sizes || []).filter(
        (item: any) => item && item.id && item.name
      ),
      genders: (parsed.genders || []).filter(
        (item: any) => item && item.id && item.name
      ),
      species: (parsed.species || []).filter(
        (item: any) => item && item.id && item.name
      ),
      statuses: (parsed.statuses || []).filter(
        (item: any) => item && item.id && item.name
      ),
      shelters: (parsed.shelters || []).filter(
        (item: any) => item && item.id && item.name
      ),
      breeds: (parsed.breeds || []).filter(
        (item: any) => item && item.id && item.name
      ),
      cities: (parsed.cities || []).filter(
        (item: any) => item && item.id && item.name
      ),
      filterOptions: (parsed.filterOptions || []).filter(
        (item: any) => item && item.id
      ),
    };
    console.log('✅ referenceData נטענה מ-localStorage:', clean);
    return clean;
  } catch (error) {
    console.error('שגיאה בטעינת referenceData:', error);
    localStorage.removeItem('referenceData'); // ניקוי אם שגוי
    return {
      sizes: [],
      genders: [],
      species: [],
      statuses: [],
      shelters: [],
      breeds: [],
      cities: [],
      filterOptions: [],
    };
  }
};
