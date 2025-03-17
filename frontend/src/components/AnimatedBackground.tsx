
import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial sizing
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Node class for blockchain network visualization
    class Node {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      connected: boolean;
      riskScore: number;
      isBlock: boolean;
      blockSize: number;
      
      constructor(x: number, y: number, radius: number, isBlock: boolean = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.riskScore = Math.random();
        this.isBlock = isBlock;
        this.blockSize = isBlock ? radius * 1.5 : radius;
        
        // Color based on risk (green for low risk, yellow for medium, red for high)
        if (this.riskScore > 0.66) {
          this.color = 'rgba(239, 68, 68, 0.4)'; // High risk (red)
        } else if (this.riskScore > 0.33) {
          this.color = 'rgba(245, 158, 11, 0.4)'; // Medium risk (amber)
        } else {
          this.color = 'rgba(34, 197, 94, 0.4)'; // Low risk (green)
        }
        
        // Random velocity
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.connected = false;
      }
      
      update() {
        // Move node
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < this.radius || this.x > canvas.width - this.radius) {
          this.vx *= -1;
        }
        
        if (this.y < this.radius || this.y > canvas.height - this.radius) {
          this.vy *= -1;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        if (this.isBlock) {
          // Draw a blockchain block (square with rounded corners)
          ctx.beginPath();
          ctx.roundRect(this.x - this.blockSize, this.y - this.blockSize, this.blockSize * 2, this.blockSize * 2, 4);
          ctx.fillStyle = this.color;
          ctx.fill();
          
          // Draw hash pattern inside the block
          ctx.beginPath();
          ctx.moveTo(this.x - this.blockSize * 0.6, this.y - this.blockSize * 0.3);
          ctx.lineTo(this.x + this.blockSize * 0.6, this.y - this.blockSize * 0.3);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(this.x - this.blockSize * 0.6, this.y);
          ctx.lineTo(this.x + this.blockSize * 0.6, this.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(this.x - this.blockSize * 0.6, this.y + this.blockSize * 0.3);
          ctx.lineTo(this.x + this.blockSize * 0.6, this.y + this.blockSize * 0.3);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.stroke();
        } else {
          // Draw circular node representing transactions or wallet addresses
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
    }
    
    // Create nodes
    const nodeCount = Math.floor(window.innerWidth / 100); // Adjust node density
    const nodes: Node[] = [];
    
    // Add regular nodes (transactions/wallets)
    for (let i = 0; i < nodeCount; i++) {
      const radius = Math.random() * 5 + 3;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const isBlock = Math.random() > 0.7; // 30% chance to be a blockchain block
      nodes.push(new Node(x, y, radius, isBlock));
    }
    
    // Add a few larger nodes to represent major blockchain blocks
    for (let i = 0; i < Math.floor(nodeCount / 6); i++) {
      const radius = Math.random() * 8 + 8;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      nodes.push(new Node(x, y, radius, true));
    }
    
    // Mouse position for interaction
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw(ctx);
        node.connected = false;
      });
      
      // Draw connections between nearby nodes (representing blockchain transactions)
      const maxDistance = 150;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Calculate connection opacity based on distance
            const opacity = 1 - distance / maxDistance;
            
            // Determine connection color based on risk scores
            const avgRisk = (nodes[i].riskScore + nodes[j].riskScore) / 2;
            let strokeColor;
            
            if (avgRisk > 0.66) {
              strokeColor = `rgba(239, 68, 68, ${opacity * 0.3})`; // High risk (red)
            } else if (avgRisk > 0.33) {
              strokeColor = `rgba(245, 158, 11, ${opacity * 0.3})`; // Medium risk (amber)
            } else {
              strokeColor = `rgba(34, 197, 94, ${opacity * 0.3})`; // Low risk (green)
            }
            
            // Draw connection with a dotted line for blockchain-style
            ctx.beginPath();
            ctx.setLineDash([2, 3]);
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = nodes[i].isBlock || nodes[j].isBlock ? 1.5 : 1;
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Mark nodes as connected
            nodes[i].connected = true;
            nodes[j].connected = true;
            
            // Sometimes add small data packets moving along the connections
            if (Math.random() > 0.995) {
              const packetSize = 2;
              const packetX = nodes[i].x + (nodes[j].x - nodes[i].x) * Math.random();
              const packetY = nodes[i].y + (nodes[j].y - nodes[i].y) * Math.random();
              
              ctx.beginPath();
              ctx.arc(packetX, packetY, packetSize, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fill();
            }
          }
        }
      }
      
      // Draw a highlight effect around the mouse to show the risk analysis feature
      const highlightRadius = 120;
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, highlightRadius);
      gradient.addColorStop(0, 'rgba(155, 135, 245, 0.1)'); // AssureFi brand color
      gradient.addColorStop(1, 'rgba(155, 135, 245, 0)');
      
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, highlightRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Highlight nodes near the cursor to simulate "scanning" or "analyzing" for risks
      nodes.forEach(node => {
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < highlightRadius) {
          const highlightIntensity = 1 - distance / highlightRadius;
          
          // Draw a risk assessment circle around nodes
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
          
          // Color based on risk level
          let highlightColor;
          if (node.riskScore > 0.66) {
            highlightColor = `rgba(239, 68, 68, ${highlightIntensity * 0.5})`; // High risk (red)
          } else if (node.riskScore > 0.33) {
            highlightColor = `rgba(245, 158, 11, ${highlightIntensity * 0.5})`; // Medium risk (amber)
          } else {
            highlightColor = `rgba(34, 197, 94, ${highlightIntensity * 0.5})`; // Low risk (green)
          }
          
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Nodes are repelled slightly by cursor
          const force = 0.3 * highlightIntensity;
          const angle = Math.atan2(dy, dx);
          node.vx -= Math.cos(angle) * force;
          node.vy -= Math.sin(angle) * force;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    // Track mouse position
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-auto -z-10 opacity-30 dark:opacity-20"
    />
  );
};

export default AnimatedBackground;
