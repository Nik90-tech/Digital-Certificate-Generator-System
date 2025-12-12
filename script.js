// Initialize jsPDF
const { jsPDF } = window.jspdf;

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const certificateForm = document.getElementById('certificateForm');
const certificatePreview = document.getElementById('certificatePreview');
const certificatesGrid = document.getElementById('certificatesGrid');
const emptyState = document.getElementById('emptyState');

// Form inputs
const studentName = document.getElementById('studentName');
const courseName = document.getElementById('courseName');
const issuedBy = document.getElementById('issuedBy');
const issueDate = document.getElementById('issueDate');
const duration = document.getElementById('duration');
const certificateId = document.getElementById('certificateId');
const grade = document.getElementById('grade');
const logoUpload = document.getElementById('logoUpload');
const signatureUpload = document.getElementById('signatureUpload');

// Preview elements
const previewName = document.getElementById('previewName');
const previewCourse = document.getElementById('previewCourse');
const previewIssuedBy = document.getElementById('previewIssuedBy');
const previewDate = document.getElementById('previewDate');
const previewDuration = document.getElementById('previewDuration');
const previewGrade = document.getElementById('previewGrade');
const previewGradeContainer = document.getElementById('previewGradeContainer');
const previewId = document.getElementById('previewId');
const previewLogo = document.getElementById('previewLogo');
const previewSignature = document.getElementById('previewSignature');
const previewQr = document.getElementById('previewQr');

// Buttons
const generateBtn = document.getElementById('generateBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const printBtn = document.getElementById('printBtn');

// File input labels
const logoFileName = document.getElementById('logoFileName');
const signatureFileName = document.getElementById('signatureFileName');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    issueDate.value = today;
    previewDate.textContent = formatDate(today);

    // Generate initial certificate ID
    generateCertificateId();

    // Load past certificates from localStorage
    loadPastCertificates();

    // Set up event listeners
    setupEventListeners();

    // Check for saved theme preference
    checkSavedTheme();
});

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Form inputs for live preview
    studentName.addEventListener('input', updatePreview);
    courseName.addEventListener('input', updatePreview);
    issuedBy.addEventListener('input', updatePreview);
    issueDate.addEventListener('input', updatePreview);
    duration.addEventListener('input', updatePreview);
    grade.addEventListener('input', updatePreview);

    // File uploads
    logoUpload.addEventListener('change', handleLogoUpload);
    signatureUpload.addEventListener('change', handleSignatureUpload);

    // Action buttons
    generateBtn.addEventListener('click', generateCertificate);
    downloadPdfBtn.addEventListener('click', downloadAsPDF);
    downloadPngBtn.addEventListener('click', downloadAsPNG);
    printBtn.addEventListener('click', printCertificate);
}

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDarkMode ? '<span>☀️</span> Light Mode' : '<span>🌙</span> Dark Mode';
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Check for saved theme preference
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<span>☀️</span> Light Mode';
    }
}

// Generate unique certificate ID
function generateCertificateId() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CERT-${year}-${randomNum}`;
    certificateId.value = newId;
    previewId.textContent = newId;
    return newId;
}

// Update certificate preview in real-time
function updatePreview() {
    previewName.textContent = studentName.value || 'Student Name';
    previewCourse.textContent = courseName.value || 'Course Name';
    previewIssuedBy.textContent = issuedBy.value || 'Institute Name';
    previewDate.textContent = formatDate(issueDate.value) || 'Issue Date';
    previewDuration.textContent = duration.value || 'Duration';
    previewId.textContent = certificateId.value || 'CERT-2025-XXXX';
    
    // Handle grade display
    if (grade.value) {
        previewGrade.textContent = grade.value;
        previewGradeContainer.style.display = 'block';
    } else {
        previewGradeContainer.style.display = 'none';
    }
}

// Format date to display format
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Handle logo upload
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        logoFileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            previewLogo.src = e.target.result;
            previewLogo.onload = function() {
                // Update preview after image loads
                updatePreview();
            };
        };
        reader.readAsDataURL(file);
    }
}

// Handle signature upload
function handleSignatureUpload(event) {
    const file = event.target.files[0];
    if (file) {
        signatureFileName.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            previewSignature.src = e.target.result;
            previewSignature.onload = function() {
                // Update preview after image loads
                updatePreview();
            };
        };
        reader.readAsDataURL(file);
    }
}

// Generate QR code (simple text representation for demo)
function generateQRCode(text, element) {
    // In a real implementation, you would use a QR code library
    // For this demo, we'll create a simple representation
    element.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
            <div style="font-size: 12px; text-align: center;">QR Code</div>
            <div style="font-size: 8px; margin-top: 5px;">${text}</div>
        </div>
    `;
}

// Generate certificate and save to localStorage
function generateCertificate() {
    // Validate form
    if (!studentName.value || !courseName.value || !issuedBy.value) {
        alert('Please fill in all required fields');
        return;
    }

    // Create certificate data object
    const certificateData = {
        id: certificateId.value,
        studentName: studentName.value,
        courseName: courseName.value,
        issuedBy: issuedBy.value,
        issueDate: issueDate.value,
        duration: duration.value,
        grade: grade.value,
        logo: previewLogo.src,
        signature: previewSignature.src,
        timestamp: new Date().getTime()
    };

    // Save to localStorage
    saveCertificate(certificateData);

    // Generate QR code
    generateQRCode(certificateData.id, previewQr);

    // Show confetti animation
    createConfetti();

    // Alert success
    alert('Certificate generated successfully!');
}

// Save certificate to localStorage
function saveCertificate(certificateData) {
    let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    certificates.push(certificateData);
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    // Update UI
    loadPastCertificates();
}

// Load past certificates from localStorage
function loadPastCertificates() {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    
    if (certificates.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Clear existing thumbnails
    certificatesGrid.innerHTML = '';
    
    // Add certificate thumbnails (most recent first)
    certificates.reverse().forEach(cert => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'certificate-thumbnail';
        thumbnail.innerHTML = `
            <div class="thumbnail-name">${cert.studentName}</div>
            <div class="thumbnail-course">${cert.courseName}</div>
            <div class="thumbnail-id">${cert.id}</div>
            <div class="action-buttons">
                <button class="action-btn view" data-id="${cert.id}">View</button>
                <button class="action-btn delete" data-id="${cert.id}">Delete</button>
            </div>
        `;
        certificatesGrid.appendChild(thumbnail);
    });
    
    // Add event listeners to thumbnail buttons
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            viewCertificate(id);
        });
    });
    
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteCertificate(id);
        });
    });
}

// View a saved certificate
function viewCertificate(id) {
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const certificate = certificates.find(cert => cert.id === id);
    
    if (certificate) {
        // Fill form with certificate data
        studentName.value = certificate.studentName;
        courseName.value = certificate.courseName;
        issuedBy.value = certificate.issuedBy;
        issueDate.value = certificate.issueDate;
        duration.value = certificate.duration;
        grade.value = certificate.grade || '';
        certificateId.value = certificate.id;
        
        // Set images
        if (certificate.logo) {
            previewLogo.src = certificate.logo;
            previewLogo.onload = updatePreview;
        }
        if (certificate.signature) {
            previewSignature.src = certificate.signature;
            previewSignature.onload = updatePreview;
        }
        
        // Update preview
        updatePreview();
        
        // Generate QR code
        generateQRCode(certificate.id, previewQr);
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete a saved certificate
function deleteCertificate(id) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        certificates = certificates.filter(cert => cert.id !== id);
        localStorage.setItem('certificates', JSON.stringify(certificates));
        loadPastCertificates();
    }
}

// Wait for all images to load
function waitForImages(element) {
    return new Promise((resolve) => {
        const images = element.getElementsByTagName('img');
        if (images.length === 0) {
            resolve();
            return;
        }
        
        let loadedCount = 0;
        const totalImages = images.length;
        
        const imageLoaded = () => {
            loadedCount++;
            if (loadedCount === totalImages) {
                // Small delay to ensure everything is rendered
                setTimeout(resolve, 100);
            }
        };
        
        Array.from(images).forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                loadedCount++;
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded);
            }
        });
        
        // Check if all images are already loaded
        if (loadedCount === totalImages) {
            setTimeout(resolve, 100);
        }
    });
}

// Download certificate as PDF
async function downloadAsPDF() {
    if (!studentName.value) {
        alert('Please generate a certificate first');
        return;
    }

    try {
        // Show loading message
        downloadPdfBtn.innerHTML = '<span>⏳</span> Generating PDF...';
        downloadPdfBtn.disabled = true;

        // Wait for all images to load
        await waitForImages(certificatePreview);

        // Create a temporary container for PDF generation
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-capture';
        
        // Clone the certificate and preserve all styles
        const certificateClone = certificatePreview.cloneNode(true);
        
        // Force white background and ensure all styles are preserved
        certificateClone.style.cssText = `
            background: white !important;
            border: 20px solid transparent !important;
            border-image: linear-gradient(45deg, #4361ee, #7209b7, #4cc9f0) !important;
            border-image-slice: 1 !important;
            padding: 40px !important;
            text-align: center !important;
            width: 800px !important;
            height: 600px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234361ee' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E") !important;
        `;
        
        pdfContainer.appendChild(certificateClone);
        document.body.appendChild(pdfContainer);
        
        // Wait for images in the clone to load
        await waitForImages(certificateClone);
        
        // Small delay to ensure rendering
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture as canvas with optimal settings
        const canvas = await html2canvas(certificateClone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: true
        });

        // Remove the temporary container
        document.body.removeChild(pdfContainer);

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Get PDF page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate image dimensions to fit the page
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Center vertically if needed
        let yOffset = 0;
        if (imgHeight < pageHeight) {
            yOffset = (pageHeight - imgHeight) / 2;
        }

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        
        // Save PDF
        pdf.save(`${certificateId.value}.pdf`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try downloading as PNG instead.');
    } finally {
        // Reset button state
        downloadPdfBtn.innerHTML = '<span>📄</span> Download PDF';
        downloadPdfBtn.disabled = false;
    }
}

// Download certificate as PNG
async function downloadAsPNG() {
    if (!studentName.value) {
        alert('Please generate a certificate first');
        return;
    }

    try {
        // Show loading message
        downloadPngBtn.innerHTML = '<span>⏳</span> Generating PNG...';
        downloadPngBtn.disabled = true;

        // Wait for all images to load
        await waitForImages(certificatePreview);

        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.className = 'pdf-capture';
        
        const certificateClone = certificatePreview.cloneNode(true);
        certificateClone.style.cssText = `
            background: white !important;
            border: 20px solid transparent !important;
            border-image: linear-gradient(45deg, #4361ee, #7209b7, #4cc9f0) !important;
            border-image-slice: 1 !important;
            padding: 40px !important;
            width: 800px !important;
            height: 600px !important;
        `;
        
        tempContainer.appendChild(certificateClone);
        document.body.appendChild(tempContainer);
        
        await waitForImages(certificateClone);
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(certificateClone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        document.body.removeChild(tempContainer);

        const link = document.createElement('a');
        link.download = `${certificateId.value}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
    } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG. Please try again.');
    } finally {
        // Reset button state
        downloadPngBtn.innerHTML = '<span>🖼️</span> Download PNG';
        downloadPngBtn.disabled = false;
    }
}

// Print certificate
function printCertificate() {
    if (!studentName.value) {
        alert('Please generate a certificate first');
        return;
    }

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate - ${certificateId.value}</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh;
                    background: #f5f5f5;
                }
                .certificate { 
                    width: 100%;
                    max-width: 800px;
                    background: white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    padding: 40px;
                    text-align: center;
                    border: 20px solid transparent;
                    border-image: linear-gradient(45deg, #4361ee, #7209b7, #4cc9f0);
                    border-image-slice: 1;
                }
                .certificate-name {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #4361ee;
                    margin-bottom: 30px;
                    padding: 10px;
                    border-bottom: 3px solid #4361ee;
                    display: inline-block;
                }
                .certificate-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #4361ee;
                    margin-bottom: 10px;
                }
                @media print {
                    body { 
                        background: white; 
                        padding: 0;
                    }
                    .certificate { 
                        box-shadow: none; 
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 40px;
                    }
                }
            </style>
        </head>
        <body>
            ${certificatePreview.outerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    
    // Wait for images to load before printing
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
        }, 1000);
    };
}

// Create confetti animation
function createConfetti() {
    const colors = ['#4361ee', '#7209b7', '#4cc9f0', '#f72585', '#4895ef'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
