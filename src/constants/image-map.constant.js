import { normalizeTextSpacing } from 'src/utils'

const PUBLIC_IMAGE_PATH = 'public/imgs'

export const IMAGE_MAP = {
  [normalizeTextSpacing('Conforme')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_1_1.png`,
  [normalizeTextSpacing('No Conforme')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_1_2.png`,
  [normalizeTextSpacing('Observación')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_1_3.png`,
  [normalizeTextSpacing('No Aplica')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_2_1.png`,
  [normalizeTextSpacing('ESPECIALISTA DE SEGUIMIENTO')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_2_2.png`,
  [normalizeTextSpacing('ESPECIALISTA DE ACOMPAÑAMIENTO')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_2_3.png`,
  [normalizeTextSpacing('ESPECIALISTA EN GESTION DE PADRON')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_3_1.png`,
  [normalizeTextSpacing('CAP')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_3_2.png`,
  [normalizeTextSpacing('CAS')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_3_3.png`,
  [normalizeTextSpacing('OS')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_4_1.png`,
  [normalizeTextSpacing('Esp. Calificación')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_4_2.png`,
  [normalizeTextSpacing('Esp. Gestión y Monitoreo')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_4_3.png`,
  [normalizeTextSpacing('Analista gestión padrón')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_5_1.png`,
  [normalizeTextSpacing('Analista acompañamiento Profesional')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_5_2.png`,
  [normalizeTextSpacing('Analista supervisión')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_5_3.png`,
  [normalizeTextSpacing('Atención al usuario')]: `${PUBLIC_IMAGE_PATH}/escar-01/ES_CAR01_1_1.png`,
}
