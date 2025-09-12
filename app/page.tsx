'use client';

import { useState } from 'react';

type ParentState = {
  first: string;
  last: string;
  email: string;
  state: string;
};
type ChildState = {
  first: string;
  last: string;
  grade: string;
  interests: string[];
  programs: string[];
};

function RequestInfoForm() {
  const [step, setStep] = useState<number>(1);
  const [parent, setParent] = useState<ParentState>({
    first: '',
    last: '',
    email: '',
    state: '',
  });
  const [child, setChild] = useState<ChildState>({
    first: '',
    last: '',
    grade: '',
    interests: [],
    programs: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const academicOptions: string[] = [
    'Computer Science and Technology',
    'History and Social Science',
    'Language Arts',
    'Mathematics',
    'Science and Engineering',
  ];
  const programOptions: string[] = ['Online Programs', 'On-Campus Programs'];

  function handleParentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setParent({ ...parent, [e.target.name]: e.target.value });
  }
  function handleChildChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setChild({ ...child, [e.target.name]: e.target.value });
  }
  function handleCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>,
    group: 'interests' | 'programs'
  ) {
    const { value, checked } = e.target;
    setChild((prev) => {
      const arr = prev[group];
      return {
        ...prev,
        [group]: checked
          ? [...arr, value]
          : arr.filter((v: string) => v !== value),
      };
    });
  }

  function validateForm() {
    if (
      !parent.first.trim() ||
      !parent.last.trim() ||
      !parent.email.trim() ||
      !parent.state.trim()
    )
      return false;
    if (!child.first.trim() || !child.last.trim() || !child.grade.trim())
      return false;
    if (!child.interests.length || !child.programs.length) return false;
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!validateForm()) {
      setError(
        'Please fill out all fields and select at least one interest and one program.'
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent, child }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Your request has been sent!');
        setParent({ first: '', last: '', email: '', state: '' });
        setChild({
          first: '',
          last: '',
          grade: '',
          interests: [],
          programs: [],
        });
        setStep(1);
      } else {
        setError(data.message || 'Failed to send.');
      }
    } catch (err) {
      setError('Failed to send.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className='flex flex-col items-center justify-center gap-6 py-8'>
        <svg
          className='w-16 h-16 text-green-500'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M5 13l4 4L19 7'
          />
        </svg>
        <h2 className='text-2xl font-bold text-green-700'>Thank you!</h2>
        <p className='text-lg text-gray-700 text-center max-w-md'>
          Your request has been sent successfully. We appreciate your interest
          and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form className='w-full flex flex-col gap-4' onSubmit={handleSubmit}>
      {step === 1 && (
        <>
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <input
              type='text'
              name='first'
              value={parent.first}
              onChange={handleParentChange}
              placeholder='Parent First Name *'
              required
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-white'
            />
            <input
              type='text'
              name='last'
              value={parent.last}
              onChange={handleParentChange}
              placeholder='Parent Last Name *'
              required
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-white'
            />
          </div>
          <input
            type='email'
            name='email'
            value={parent.email}
            onChange={handleParentChange}
            placeholder='Parent Email *'
            required
            className='border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-white'
          />
          <input
            type='text'
            name='state'
            value={parent.state}
            onChange={handleParentChange}
            placeholder='State'
            className='border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-white'
          />
          <button
            type='button'
            onClick={() => {
              if (
                !parent.first.trim() ||
                !parent.last.trim() ||
                !parent.email.trim() ||
                !parent.state.trim()
              ) {
                setError('Please fill out all parent fields.');
                return;
              }
              setError(null);
              setStep(2);
            }}
            className='mt-2 cursor-pointer bg-[#0072ce] hover:bg-[#005fa3] text-white font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
          >
            Next →
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <input
              type='text'
              name='first'
              value={child.first}
              onChange={handleChildChange}
              placeholder="Child's First Name *"
              required
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-white'
            />
            <input
              type='text'
              name='last'
              value={child.last}
              onChange={handleChildChange}
              placeholder="Child's Last Name *"
              required
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-white'
            />
          </div>
          <div>
            <label className='block mb-1 font-semibold text-[#003a70] text-left'>
              Child's Grade *
            </label>
            <select
              name='grade'
              value={child.grade}
              onChange={handleChildChange}
              required
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce] text-[#222b45] dark:text-[#222b45] bg-white dark:bg-white'
            >
              <option value=''>Select Grade</option>
              {[...Array(11)].map((_, i) => (
                <option key={i + 2} value={i + 2}>
                  {i + 2}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block mb-1 font-semibold text-[#003a70] text-left'>
              Child's Academic Interest(s) *
            </label>
            <div className='flex flex-col gap-2'>
              {academicOptions.map((opt) => (
                <label key={opt} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    value={opt}
                    checked={child.interests.includes(opt)}
                    onChange={(e) => handleCheckboxChange(e, 'interests')}
                    className='accent-[#0072ce] w-5 h-5'
                  />
                  <span className='text-[#222b45] dark:text-[#222b45]'>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className='block mb-1 font-semibold text-[#003a70] text-left'>
              Program Preference(s) *
            </label>
            <div className='flex flex-col gap-2'>
              {programOptions.map((opt) => (
                <label key={opt} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    value={opt}
                    checked={child.programs.includes(opt)}
                    onChange={(e) => handleCheckboxChange(e, 'programs')}
                    className='accent-[#0072ce] w-5 h-5'
                  />
                  <span className='text-[#222b45] dark:text-[#222b45]'>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className='flex gap-4 mt-2'>
            <button
              type='button'
              onClick={() => setStep(1)}
              className='bg-gray-200 cursor-pointer hover:bg-gray-300 text-[#003a70] font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
            >
              ← Back
            </button>
            <button
              type='submit'
              className='bg-[#0072ce] cursor-pointer hover:bg-[#005fa3] text-white font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </div>

          <p className='text-xs text-gray-500 mt-2'>
            We respect your privacy. Submitting this form constitutes your
            express written consent to receive emails, phone calls, text
            messages and/or other media from Johns Hopkins Center for Talented
            Youth at the phone number(s) or email(s) received, including a
            wireless number(s). These emails, texts, calls or other media may be
            generated using automated technology. You may opt out of receiving
            any of these communications at any time. You are not required to
            provide this consent to receive services from Johns Hopkins Center
            for Talented Youth.
          </p>
        </>
      )}
      {error && <p className='text-red-600 text-sm'>{error}</p>}
    </form>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <main className='bg-[#f4f8fb] dark:bg-[#f4f8fb] min-h-screen w-full font-sans'>
      {/* Logo at the top */}
      <div className='w-full flex justify-center py-6 md:py-8 bg-white dark:bg-white border-b border-[#e5e7eb] dark:border-[#e5e7eb] px-4'>
        <img
          src='/futureofyouth.png'
          alt='Future of the Youth Logo'
          className='h-40 w-88'
        />
      </div>
      {/* Hero Section with overlay and image */}
      <section className='relative w-full flex flex-col items-center justify-center min-h-[60vh] py-8 md:py-12 bg-[#f4f8fb] dark:bg-[#f4f8fb] px-4'>
        <img
          src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=1200&h=400&facepad=3'
          alt='Hero'
          className='absolute inset-0 w-full h-full object-cover opacity-60'
        />
        <div className='relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-[#003a70] dark:text-[#003a70] drop-shadow-lg leading-tight'>
            A Chance for the Youth to Learn to Start a Business
          </h1>
          <p className='text-base sm:text-lg md:text-xl text-[#222b45] dark:text-[#222b45] font-medium px-1 sm:px-4'>
            Our nonprofit program is dedicated to empowering students from
            minority and underserved communities by providing access to free
            academic support and resources. We believe that every student
            deserves the opportunity to reach their full potential, regardless
            of background or circumstance. Through tutoring, mentorship, and
            skill-building workshops, we create a safe and encouraging space
            where students can strengthen their academic foundation, build
            confidence, and prepare for future success.
          </p>
          {/* Top section: Only Request Info Form */}
          <div className='w-full flex justify-center items-stretch mt-8'>
            <div
              className='bg-white dark:bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 flex flex-col items-center gap-6 max-w-md w-full border-t-4 h-auto'
              style={{ borderTopColor: '#0072ce' }}
            >
              <h2 className='text-2xl font-bold text-[#003a70] mb-2'>
                Request Free Program Info
              </h2>
              <RequestInfoForm />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className='w-full flex flex-col items-center py-10 md:py-16 bg-[#f4f8fb] dark:bg-[#f4f8fb] px-4'>
        <div
          className='bg-white dark:bg-white rounded-2xl shadow-xl p-4 sm:p-8 md:p-10 flex flex-col items-center gap-6 max-w-2xl w-full border-t-4'
          style={{ borderTopColor: '#0072ce' }}
        >
          <h2 className='text-2xl sm:text-3xl font-bold text-[#003a70] dark:text-[#003a70] mb-4 text-center'>
            Mission Statement
          </h2>
          <p className='text-[#222b45] dark:text-[#222b45] text-base sm:text-lg text-center px-1 sm:px-4'>
            Our mission is to empower minority youth in Detroit by providing a
            safe and supportive space to engage in sports, build community, and
            develop essential life and business skills. Through mentorship,
            education in entrepreneurship, financial literacy, and access to
            real-world tools like stock investing and business funding, we aim
            to lay a strong foundation for future leaders to grow, thrive, and
            succeed.
          </p>
        </div>
      </section>

      {/* Why CTY Section with alternating image/text and decorative backgrounds */}
      <section className='relative w-full py-10 md:py-20 bg-white dark:bg-white overflow-hidden px-4'>
        {/* Decorative shape top left */}
        <div className='absolute -top-16 -left-16 w-64 h-64 bg-[#ffd200] rounded-full opacity-30 blur-2xl z-0'></div>
        {/* Unique Courses - video left, text right */}
        <div className='relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 py-6 md:py-12'>
          <div className='rounded-2xl shadow-xl w-full md:w-1/2 overflow-hidden'>
            <video
              src='/video1.mp4'
              controls
              className='w-full h-[320px] object-cover rounded-2xl'
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='flex-1 flex flex-col gap-2 sm:gap-4 md:pl-8'>
            <h3 className='text-2xl sm:text-3xl font-bold text-[#0072ce] dark:text-[#0072ce]'>
              Engage Youth
            </h3>
            <p className='text-[#222b45] dark:text-[#222b45] text-base sm:text-lg'>
              By addressing educational gaps and providing personalized support,
              we aim to close the achievement divide and ensure that minority
              students in our community have the tools they need to thrive
              academically and beyond. Our program is not just about homework
              help—it’s about fostering resilience, promoting equity, and
              building brighter futures.
            </p>
          </div>
        </div>
        {/* Individualized Learning - text left, video right */}
        <div className='relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 py-6 md:py-12'>
          <div className='rounded-2xl shadow-xl w-full md:w-1/2 overflow-hidden'>
            <video
              src='/video2.mp4'
              controls
              className='w-full h-[320px] object-cover rounded-2xl'
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className='flex-1 flex flex-col gap-2 sm:gap-4 md:pr-8'>
            <h3 className='text-2xl sm:text-3xl font-bold text-[#003a70] dark:text-[#003a70]'>
              Individualized Learning Builds Empowerment
            </h3>
            <p className='text-[#222b45] dark:text-[#222b45] text-base sm:text-lg'>
              In addition to academic support, our program emphasizes the
              importance of life skills and overall well-being. We provide
              financial literacy education to equip students with the knowledge
              and tools they need to make informed decisions about money
              management, saving, and building a secure future. By introducing
              these concepts early, we empower young people—especially those
              from minority communities—to break cycles of financial hardship
              and create generational stability.
            </p>
            <p className='text-[#222b45] dark:text-[#222b45] text-base sm:text-lg'>
              To ensure every child can focus and thrive, we also serve free,
              nutritious lunches during all sessions. By supporting both
              learning and wellness, we’re closing the achievement gap and
              creating brighter futures for our community.
            </p>
          </div>
        </div>
        {/* Flexible Approaches - image left, text right */}
        <div className='relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 py-6 md:py-12'>
          <img
            src='/image_3.jpeg'
            alt='Flexible Approaches'
            className='rounded-2xl shadow-xl w-full md:w-1/2 object-cover h-[520px]'
          />
          <div className='flex-1 flex flex-col gap-2 sm:gap-4 md:pl-8'>
            <h3 className='text-2xl sm:text-3xl font-bold text-[#ffd200] dark:text-[#ffd200]'>
              Flexible Approaches for Bright Minds
            </h3>
            <p className='text-[#222b45] dark:text-[#222b45] text-base sm:text-lg'>
              We are deeply grateful for the support of our community,
              volunteers, and partners who make this work possible. Every
              tutoring session, every shared meal, and every moment of
              encouragement helps create lasting change. Together, we are not
              just building stronger students—we are building brighter futures.
            </p>
          </div>
        </div>
        {/* Decorative shape bottom right */}
        <div className='absolute -bottom-16 -right-16 w-64 h-64 bg-[#0072ce] rounded-full opacity-20 blur-2xl z-0'></div>
      </section>

      {/* Testimonial Section with image and quote */}
      <section className='w-full bg-white dark:bg-white py-10 md:py-16 flex flex-col items-center gap-6 shadow-inner px-4'>
        <img
          src='/student.jpg'
          alt='Testimonial'
          className='w-24 h-24 rounded-full shadow-lg'
        />
        <blockquote className='italic text-base sm:text-lg text-center text-[#222b45] dark:text-[#222b45] max-w-2xl px-1 sm:px-4'>
          “You build lifelong friendships at Future of the Youth. The classes
          seem really intense at first, but the teachers ease you into it.
          Everyone is happy and friendly, and we always do fun activities and
          challenges.”
        </blockquote>
        <span className='font-semibold text-[#0072ce] dark:text-[#0072ce]'>
          Nicole, Future of the Youth Student
        </span>
      </section>

      {/* Request Free Program Info Form Section (Bottom) */}
      <section className='w-full flex flex-col items-center py-10 md:py-16 bg-[#f4f8fb] dark:bg-[#f4f8fb] px-4'>
        <div
          className='bg-white dark:bg-white rounded-2xl shadow-xl p-4 sm:p-8 md:p-10 flex flex-col items-center gap-6 max-w-xl w-full border-t-4'
          style={{ borderTopColor: '#0072ce' }}
        >
          <h2 className='text-2xl font-bold text-[#003a70] mb-2'>
            Request Free Program Info
          </h2>
          <RequestInfoForm />
        </div>
      </section>

      {/* PayPal Section (Bottom) */}
      <section
        id='paypal-section'
        className='w-full flex flex-col items-center py-10 md:py-16 bg-[#f4f8fb] dark:bg-[#f4f8fb] px-4'
      >
        <div
          className='bg-white dark:bg-white rounded-2xl shadow-xl p-4 sm:p-8 md:p-10 flex flex-col items-center gap-6 max-w-xl w-full border-t-4'
          style={{ borderTopColor: '#ffd200' }}
        >
          <h2 className='text-2xl font-bold text-[#0072ce] dark:text-[#0072ce] mb-2'>
            Support the Youth
          </h2>
          <p className='text-[#222b45] dark:text-[#222b45] text-center mb-4'>
            Help us nurture the next generation of bright minds. Make a
            contribution or pay for a program using PayPal.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_PAYPAL_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-[#0072ce] hover:bg-[#005fa3] text-white font-semibold py-3 px-8 rounded-lg shadow transition text-lg dark:bg-[#0072ce] dark:hover:bg-[#005fa3] dark:text-white'
          >
            Pay with PayPal
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='w-full py-6 md:py-8 flex flex-col items-center gap-2 text-gray-500 dark:text-gray-500 text-sm mt-8 px-4'>
        <span>© {currentYear} Future of the Youth. All rights reserved.</span>
      </footer>
    </main>
  );
}
