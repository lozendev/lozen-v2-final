import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';

// --- Shader Material ---
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uProgress;
uniform float uIntensity;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uDisp;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  vec4 disp = texture2D(uDisp, uv);
  
  vec2 distortedPosition1 = vec2(uv.x + disp.r * (uProgress * uIntensity), uv.y);
  vec2 distortedPosition2 = vec2(uv.x - (1.0 - uProgress) * disp.r * uIntensity, uv.y);
  
  vec4 _texture1 = texture2D(uTexture1, distortedPosition1);
  vec4 _texture2 = texture2D(uTexture2, distortedPosition2);
  
  gl_FragColor = mix(_texture1, _texture2, uProgress);
}
`;

// --- Components ---

const SlideTexture = ({ url, onLoaded }) => {
    // Hidden video texture loader
    const texture = useVideoTexture(url, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
        crossOrigin: 'Anonymous',
    });

    useEffect(() => {
        if (texture) onLoaded(texture);
    }, [texture, onLoaded]);

    return null;
};

const TransitionPlane = ({ currentSlide, slides }) => {
    const meshRef = useRef();
    const { viewport } = useThree();
    const [textures, setTextures] = useState(new Array(slides.length).fill(null));

    // Shader Uniforms
    const uniforms = useMemo(() => ({
        uProgress: { value: 0 },
        uIntensity: { value: 0.5 },
        uTexture1: { value: null },
        uTexture2: { value: null },
        uDisp: { value: null }
    }), []);

    // Generate Noise Texture for Displacement
    useEffect(() => {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        for (let i = 0; i < size * size * 4; i++) {
            data[i] = Math.random() * 255;
        }
        const noiseTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        noiseTexture.needsUpdate = true;
        uniforms.uDisp.value = noiseTexture;
    }, [uniforms]);

    // Manage Transitions
    const currentIdxRef = useRef(currentSlide);
    const prevIdxRef = useRef(currentSlide);
    const progressRef = useRef(0);
    const isTransitioning = useRef(false);

    useEffect(() => {
        if (currentSlide !== currentIdxRef.current) {
            prevIdxRef.current = currentIdxRef.current;
            currentIdxRef.current = currentSlide;
            isTransitioning.current = true;
            progressRef.current = 0;

            // Set textures for transition
            if (textures[prevIdxRef.current] && textures[currentIdxRef.current]) {
                uniforms.uTexture1.value = textures[prevIdxRef.current];
                uniforms.uTexture2.value = textures[currentIdxRef.current];
            }
        }
    }, [currentSlide, textures, uniforms]);

    // Initial Texture Setup
    useEffect(() => {
        if (textures[currentSlide] && !uniforms.uTexture1.value) {
            uniforms.uTexture1.value = textures[currentSlide];
            // Ensure uTexture2 is set to avoid webgl warnings, though visually unused initially
            uniforms.uTexture2.value = textures[currentSlide];
        }
    }, [textures, currentSlide, uniforms]);

    useFrame((state, delta) => {
        if (isTransitioning.current) {
            // Animate progress
            progressRef.current += delta * 1.5; // Adjust speed here

            if (progressRef.current >= 1) {
                progressRef.current = 1;
                isTransitioning.current = false;
                // Swap texture1 to be current for next time
                uniforms.uTexture1.value = textures[currentIdxRef.current];
            }

            uniforms.uProgress.value = progressRef.current;
        }
    });

    // Handle texture loading callbacks
    const handleTextureLoad = (tex, index) => {
        setTextures(prev => {
            const next = [...prev];
            next[index] = tex;
            return next;
        });
    };

    return (
        <>
            {/* Load all textures */}
            {slides.map((slide, idx) => (
                <SlideTexture
                    key={slide.id}
                    url={slide.video}
                    onLoaded={(tex) => handleTextureLoad(tex, idx)}
                />
            ))}

            <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
                <planeGeometry args={[1, 1]} />
                <shaderMaterial
                    fragmentShader={fragmentShader}
                    vertexShader={vertexShader}
                    uniforms={uniforms}
                />
            </mesh>
        </>
    );
};

const BackgroundScene = ({ currentSlide, slides }) => {
    return (
        <div className="absolute inset-0 z-0 bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1]}>
                <TransitionPlane currentSlide={currentSlide} slides={slides} />
            </Canvas>
        </div>
    );
};

export default BackgroundScene;
