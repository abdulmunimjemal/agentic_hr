'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const PRIMARY_COLOR = '#364957';
const SECONDARY_COLOR = '#FF8A00';

interface ApplyFormProps {
  jobId: string;
}

export default function ApplyForm({ jobId }: ApplyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, resume: acceptedFiles[0] });
    },
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [PRIMARY_COLOR, SECONDARY_COLOR, '#ffffff'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      if (formData.resume) formPayload.append('resume', formData.resume);

      const response = await fetch(`http://localhost:9000/jobs/${jobId}/apply`, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Application failed');

      const { application_id } = await response.json();
      setIsSubmitted(true);
      triggerConfetti();

      // Redirect after showing success animation
      setTimeout(() => {
        window.location.href = `/`;
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const successVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="p-8 h-fit sticky top-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                Apply Now
              </h2>
              <p className="text-primary/60">
                Help us shape the future of African fintech
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label style={{ color: `${PRIMARY_COLOR}CC` }}>Full Name</Label>
                <Input
                  required
                  style={{
                    backgroundColor: `${PRIMARY_COLOR}0A`,
                    borderColor: `${PRIMARY_COLOR}20`,
                  }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label style={{ color: `${PRIMARY_COLOR}CC` }}>Email</Label>
                <Input
                  type="email"
                  required
                  style={{
                    backgroundColor: `${PRIMARY_COLOR}0A`,
                    borderColor: `${PRIMARY_COLOR}20`,
                  }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label style={{ color: `${PRIMARY_COLOR}CC` }}>Resume (PDF only)</Label>
                <div
                  {...getRootProps()}
                  style={{
                    borderColor: isDragActive ? SECONDARY_COLOR : `${PRIMARY_COLOR}20`,
                    backgroundColor: isDragActive ? `${SECONDARY_COLOR}10` : 'transparent',
                  }}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                >
                  <input {...getInputProps()} />
                  <div className="space-y-2">
                    <ArrowUpRight
                      className="w-8 h-8 mx-auto"
                      style={{ color: isDragActive ? SECONDARY_COLOR : `${PRIMARY_COLOR}40` }}
                    />
                    <p style={{ color: isDragActive ? SECONDARY_COLOR : `${PRIMARY_COLOR}AA` }}>
                      {formData.resume ? (
                        <span style={{ color: SECONDARY_COLOR }}>{formData.resume.name}</span>
                      ) : isDragActive ? (
                        'Drop PDF here'
                      ) : (
                        'Drag & drop or click to upload'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm" style={{ color: SECONDARY_COLOR }}>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full transition-colors"
                style={{
                  backgroundColor: SECONDARY_COLOR,
                  color: 'white',
                  borderColor: SECONDARY_COLOR,
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-[400px]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
            >
              <CheckCircle
                className="w-24 h-24 mb-6"
                style={{ color: SECONDARY_COLOR }}
              />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
              style={{ color: PRIMARY_COLOR }}
            >
              Application Submitted!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-primary/60"
            >
              Thank you for applying. We'll be in touch soon!
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.5 }}
              className="h-1 w-24 mt-8 rounded-full"
              style={{ backgroundColor: SECONDARY_COLOR }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}