// src/app/jobs/[jobId]/apply/page.tsx
import { Briefcase, Clock, MapPin } from 'lucide-react';
import ApplyForm from '@/components/apply-form';

const PRIMARY_COLOR = '#364957';
const SECONDARY_COLOR = '#FF8A00';

interface JobApplicationPageProps {
  params: {
    jobId: string;
  };
}

export default function JobApplicationPage({ params }: JobApplicationPageProps) {
  const { jobId } = params;

  return (
    <div className="container max-w-7xl py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Job Details */}
        <div className="space-y-8">
          <div className="border-b pb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Job Title
            </h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-primary/80">
                <Briefcase className="w-5 h-5" />
                <span>Engineering</span>
              </div>
              <div className="flex items-center gap-2 text-primary/80">
                <MapPin className="w-5 h-5" />
                <span>Addis Ababa</span>
              </div>
              <div className="flex items-center gap-2 text-primary/80">
                <Clock className="w-5 h-5" />
                <span>Full-time</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              About the Role
            </h2>
            <p className="text-primary/80">
              Join our engineering team to build cutting-edge financial solutions...
            </p>

            <h3 className="text-xl font-semibold text-primary mt-8 mb-4">
              Responsibilities
            </h3>
            <ul className="space-y-2 text-primary/80">
              <li>• Develop core banking systems</li>
              <li>• Implement secure transaction protocols</li>
              <li>• Collaborate with product teams</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mt-8 mb-4">
              Requirements
            </h3>
            <ul className="space-y-2 text-primary/80">
              <li>• 5+ years software development experience</li>
              <li>• Financial systems background</li>
              <li>• Modern tech stack proficiency</li>
            </ul>
          </div>
        </div>

        {/* Application Form */}
        <ApplyForm jobId={jobId} />
      </div>

      {/* Hiring Process Section */}
      <div
        className="mt-16 border-t pt-16"
        style={{ borderColor: `${PRIMARY_COLOR}20` }}
      >
        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ color: PRIMARY_COLOR }}
        >
          Our Hiring Process
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['Application Review', 'AI Interview', 'Team Interview'].map((step, i) => (
            <div
              key={step}
              className="text-center p-6 rounded-xl"
              style={{
                backgroundColor: `${PRIMARY_COLOR}08`,
                border: `1px solid ${PRIMARY_COLOR}20`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: `${SECONDARY_COLOR}15`,
                  color: SECONDARY_COLOR,
                }}
              >
                <span className="font-bold">{i + 1}</span>
              </div>
              <h3
                className="font-semibold mb-2"
                style={{ color: PRIMARY_COLOR }}
              >
                {step}
              </h3>
              <p style={{ color: `${PRIMARY_COLOR}AA` }}>
                Typically 1-2 business days
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}