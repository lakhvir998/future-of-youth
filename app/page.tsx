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

  return (
    <form className='w-full flex flex-col gap-4'>
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
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
            />
            <input
              type='text'
              name='last'
              value={parent.last}
              onChange={handleParentChange}
              placeholder='Parent Last Name *'
              required
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
            />
          </div>
          <input
            type='email'
            name='email'
            value={parent.email}
            onChange={handleParentChange}
            placeholder='Parent Email *'
            required
            className='border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
          />
          <input
            type='text'
            name='state'
            value={parent.state}
            onChange={handleParentChange}
            placeholder='State'
            className='border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
          />
          <button
            type='button'
            onClick={() => setStep(2)}
            className='mt-2 bg-[#0072ce] hover:bg-[#005fa3] text-white font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
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
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
            />
            <input
              type='text'
              name='last'
              value={child.last}
              onChange={handleChildChange}
              placeholder="Child's Last Name *"
              required
              className='flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
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
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072ce]'
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
                  <span>{opt}</span>
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
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div className='flex gap-4 mt-2'>
            <button
              type='button'
              onClick={() => setStep(1)}
              className='bg-gray-200 hover:bg-gray-300 text-[#003a70] font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
            >
              ← Back
            </button>
            <button
              type='submit'
              className='bg-[#0072ce] hover:bg-[#005fa3] text-white font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
            >
              Submit
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
    </form>
  );
}

export default function Home() {
  return (
    <main className='bg-[#f4f8fb] min-h-screen w-full font-sans'>
      {/* Logo at the top */}
      <div className='w-full flex justify-center py-8 bg-white border-b border-[#e5e7eb]'>
        <img
          src='/futureofyouth.png'
          alt='Future of Youth Logo'
          className='h-16 w-48'
        />
      </div>
      {/* Hero Section with overlay and image */}
      <section className='relative w-full flex flex-col items-center justify-center min-h-[60vh] py-12 bg-[#f4f8fb]'>
        <img
          src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=1200&h=400&facepad=3'
          alt='Hero'
          className='absolute inset-0 w-full h-full object-cover opacity-60'
        />
        <div className='relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6'>
          <h1 className='text-4xl md:text-5xl font-bold text-[#003a70] drop-shadow-lg'>
            A Chance for Advanced Learners to Study What They Love
          </h1>
          <p className='text-lg md:text-xl text-[#222b45] font-medium'>
            As the country’s first academic talent center, Johns Hopkins
            University’s Center for Talented Youth (Future of Youth) supports
            and advocates for advanced learners to make sure they achieve their
            full academic potential.
          </p>
          {/* Top section: Only Request Info Form */}
          <div className='w-full flex justify-center items-stretch mt-8'>
            <div
              className='bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 max-w-md w-full border-t-4 h-auto'
              style={{ borderTopColor: '#0072ce' }}
            >
              <h2 className='text-xl font-bold text-[#003a70] mb-2'>
                Request Free Program Info
              </h2>
              <RequestInfoForm />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className='w-full flex flex-col items-center py-16 bg-[#f4f8fb]'>
        <div
          className='bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-2xl w-full border-t-4'
          style={{ borderTopColor: '#0072ce' }}
        >
          <h2 className='text-3xl font-bold text-[#003a70] mb-4'>
            Mission Statement
          </h2>
          <p className='text-[#222b45] text-lg text-center'>
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
      <section className='relative w-full py-20 bg-white overflow-hidden'>
        {/* Decorative shape top left */}
        <div className='absolute -top-16 -left-16 w-64 h-64 bg-[#ffd200] rounded-full opacity-30 blur-2xl z-0'></div>
        {/* Unique Courses - image left, text right */}
        <div className='relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 py-12'>
          <img
            src='https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=320&facepad=3'
            alt='Unique Courses'
            className='rounded-2xl shadow-xl w-full md:w-1/2 object-cover'
          />
          <div className='flex-1 flex flex-col gap-4 md:pl-8'>
            <h3 className='text-3xl font-bold text-[#0072ce]'>
              Unique Courses Engage Advanced Learners
            </h3>
            <p className='text-[#222b45] text-lg'>
              Johns Hopkins research informs Future of Youth’s enriching
              academic experiences for advanced learners. An accelerated pace
              lets your child cover up to an entire semester in a few weeks.
              From robotics and Arabic to physics and philosophy, they’ll study
              what they love and work to their full potential.
            </p>
          </div>
        </div>
        {/* Individualized Learning - text left, image right */}
        <div className='relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 py-12'>
          <img
            src='https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=320&facepad=3'
            alt='Individualized Learning'
            className='rounded-2xl shadow-xl w-full md:w-1/2 object-cover'
          />
          <div className='flex-1 flex flex-col gap-4 md:pr-8'>
            <h3 className='text-3xl font-bold text-[#003a70]'>
              Individualized Learning Builds Empowerment
            </h3>
            <p className='text-[#222b45] text-lg'>
              World-class instructors help your child move at their own pace as
              they dig into challenging, thought-provoking courses they can’t
              access at school. Curiosity soars as they gain confidence, find
              belonging, and have space to succeed—and safely fail—in a
              supportive environment.
            </p>
          </div>
        </div>
        {/* Flexible Approaches - image left, text right */}
        <div className='relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 py-12'>
          <img
            src='https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=facearea&w=400&h=320&facepad=3'
            alt='Flexible Approaches'
            className='rounded-2xl shadow-xl w-full md:w-1/2 object-cover'
          />
          <div className='flex-1 flex flex-col gap-4 md:pl-8'>
            <h3 className='text-3xl font-bold text-[#ffd200]'>
              Flexible Approaches for Bright Minds
            </h3>
            <p className='text-[#222b45] text-lg'>
              Choose from year-round online options and on-campus summer
              programs. Your child will broaden their horizons and experience
              subjects not offered in most schools. Through our accredited
              courses, they can even earn school credit.
            </p>
          </div>
        </div>
        {/* Decorative shape bottom right */}
        <div className='absolute -bottom-16 -right-16 w-64 h-64 bg-[#0072ce] rounded-full opacity-20 blur-2xl z-0'></div>
      </section>

      {/* Testimonial Section with image and quote */}
      <section className='w-full bg-white py-16 flex flex-col items-center gap-6 shadow-inner'>
        <img
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Testimonial'
          className='w-24 h-24 rounded-full shadow-lg'
        />
        <blockquote className='italic text-lg text-center text-[#222b45] max-w-2xl'>
          “You build lifelong friendships at Future of Youth. The classes seem
          really intense at first, but the teachers ease you into it. Everyone
          is happy and friendly, and we always do fun activities and
          challenges.”
        </blockquote>
        <span className='font-semibold text-[#0072ce]'>
          Rakeb, Future of Youth Student
        </span>
      </section>

      {/* Request Free Program Info Form Section (Bottom) */}
      <section className='w-full flex flex-col items-center py-16 bg-[#f4f8fb]'>
        <div
          className='bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-xl w-full border-t-4'
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
        className='w-full flex flex-col items-center py-16 bg-[#f4f8fb]'
      >
        <div
          className='bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-xl w-full border-t-4'
          style={{ borderTopColor: '#ffd200' }}
        >
          <h2 className='text-2xl font-bold text-[#0072ce] mb-2'>
            Support Advanced Learners
          </h2>
          <p className='text-[#222b45] text-center mb-4'>
            Help us nurture the next generation of bright minds. Make a
            contribution or pay for a program using PayPal.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_PAYPAL_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-[#0072ce] hover:bg-[#005fa3] text-white font-semibold py-3 px-8 rounded-lg shadow transition text-lg'
          >
            Pay with PayPal
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className='w-full py-8 flex flex-col items-center gap-2 text-gray-500 text-sm mt-8'>
        <span>© 2025 Future of Youth. All rights reserved.</span>
        <a href='/privacy-policy' className='underline hover:text-[#0072ce]'>
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}
