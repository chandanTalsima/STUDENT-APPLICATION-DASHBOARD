export const API_BASE_URL = 'https://130518web.saas.talismaonline.com/cxmai/api/copilotresponses';

export const getCxmaiUrl = (studentId) => {
  return `${window.location.origin}/cxm.ai/?ContactId=${studentId}&Role=OCR_new`;
};
