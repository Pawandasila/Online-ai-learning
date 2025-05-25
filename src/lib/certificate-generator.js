import { createCanvas, loadImage } from 'canvas';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateCertificate(userName, courseName, completionDate) {
  try {
    // Create canvas
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    // Set background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Add border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 760);

    // Inner border
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 720);

    // Certificate title
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', 600, 150);

    // Decorative line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(1000, 180);
    ctx.stroke();

    // Main text
    ctx.fillStyle = '#374151';
    ctx.font = '36px Arial';
    ctx.fillText('This is to certify that', 600, 280);

    // User name
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(userName, 600, 350);

    // Course completion text
    ctx.fillStyle = '#374151';
    ctx.font = '36px Arial';
    ctx.fillText('has successfully completed the course', 600, 420);

    // Course name
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 42px Arial';
    ctx.fillText(courseName, 600, 490);

    // Date
    ctx.fillStyle = '#6b7280';
    ctx.font = '28px Arial';
    ctx.fillText(`Completed on: ${completionDate}`, 600, 580);

    // Signature area
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('AI Learning Platform', 150, 700);
    
    // Signature line
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 720);
    ctx.lineTo(400, 720);
    ctx.stroke();

    // Certificate ID
    ctx.textAlign = 'right';
    ctx.fillStyle = '#9ca3af';
    ctx.font = '20px Arial';
    const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}`;
    ctx.fillText(`Certificate ID: ${certificateId}`, 1050, 700);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `certificates/cert_${Date.now()}`,
          format: 'png',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      url: uploadResult.secure_url,
      certificateId,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw new Error('Failed to generate certificate');
  }
}
