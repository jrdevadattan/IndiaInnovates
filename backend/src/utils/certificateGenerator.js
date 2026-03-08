const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateCertificatePdf = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
      const buffers = [];

      doc.on('data', chunk => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const verifyUrl = `${process.env.CLIENT_URL}/verify-cert/${user._id}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl);
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0fdf4');

      // Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3).stroke('#16a34a');

      // Header
      doc.fontSize(36).fillColor('#15803d').font('Helvetica-Bold')
        .text('LIFELINE', 0, 60, { align: 'center' });

      doc.fontSize(16).fillColor('#6b7280').font('Helvetica')
        .text('Community Impact Platform', 0, 105, { align: 'center' });

      // Certificate title
      doc.fontSize(28).fillColor('#1f2937').font('Helvetica-Bold')
        .text('Certificate of Participation', 0, 155, { align: 'center' });

      doc.fontSize(16).fillColor('#6b7280').font('Helvetica')
        .text('This certifies that', 0, 200, { align: 'center' });

      // Name
      doc.fontSize(32).fillColor('#111827').font('Helvetica-Bold')
        .text(user.name, 0, 230, { align: 'center' });

      // Description
      doc.fontSize(14).fillColor('#374151').font('Helvetica')
        .text('has actively contributed to the LIFELINE community platform,\nhelping improve civic engagement and social impact.', 0, 285, { align: 'center', lineGap: 6 });

      // Date
      const date = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.fontSize(12).fillColor('#6b7280')
        .text(`Issued on: ${date}`, 0, 360, { align: 'center' });

      // QR Code
      const qrX = doc.page.width - 130;
      const qrY = doc.page.height - 130;
      doc.image(qrBuffer, qrX, qrY, { width: 80, height: 80 });
      doc.fontSize(8).fillColor('#9ca3af')
        .text('Scan to verify', qrX - 5, qrY + 85, { width: 90, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateCertificatePdf };
