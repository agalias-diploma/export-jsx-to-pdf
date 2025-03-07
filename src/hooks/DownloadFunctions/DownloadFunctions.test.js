import { handleDownloadPDF } from './DownloadFunctions'; 

describe('handleDownloadPDF', () => {
  it('downloads content as PDF', () => {
    const targetRef = {}; 
    const filename = 'test-pdf-file';
    const Resolution = { MEDIUM: 'medium' }; 
    const Margin = { MEDIUM: 'medium' }; 
    const generatePDF = jest.fn();

    handleDownloadPDF(targetRef, filename, Resolution, Margin, generatePDF);

    expect(generatePDF).toHaveBeenCalled();
  });
});
