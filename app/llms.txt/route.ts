import { AI_TECH_INTRO, AI_TOPICS } from '@/lib/content/ai-technology';
import {
  HERO_HEADLINE,
  HERO_INTRO,
  IMPACT_PARAGRAPHS,
  IMPACT_TITLE,
  MISSION_STATEMENT,
  VISION_PARAGRAPHS,
} from '@/lib/content/home';
import { NONPROFIT_STATEMENT } from '@/lib/content/organization';
import { PAGES } from '@/lib/content/pages';
import { PROGRAMS } from '@/lib/content/programs';
import {
  getPaypalUrl,
  getSiteUrl,
  REQUEST_INFO_HREF,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/site';

export const dynamic = 'force-static';

// llms.txt (https://llmstxt.org): a plain-text summary for AI answer engines,
// built from the same copy the pages render.
export function GET() {
  const siteUrl = getSiteUrl();
  const url = (path: string) => new URL(path, siteUrl).toString();
  const paypalUrl = getPaypalUrl();

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${NONPROFIT_STATEMENT}

## ${HERO_HEADLINE}

${HERO_INTRO}

## Our Mission

${MISSION_STATEMENT}

## Our Vision

${VISION_PARAGRAPHS.join(' ')}

## ${IMPACT_TITLE}

${IMPACT_PARAGRAPHS.join(' ')}

## Programs

${PROGRAMS.map((program) => `- [${program.title}](${url(program.href)}): ${program.summary}`).join('\n')}

## AI & Technology

${AI_TECH_INTRO}

${AI_TOPICS.map((topic) => `- ${topic.title}: ${topic.description}`).join('\n')}

## Pages

${Object.values(PAGES)
  .map((page) => `- [${page.label}](${url(page.path)}): ${page.description}`)
  .join('\n')}

## Take Action

- [Request Free Program Info](${url(REQUEST_INFO_HREF)})
- [Donate](${url('/donate')})${paypalUrl ? `\n- [Donate Now (PayPal)](${paypalUrl})` : ''}
- [Get Involved](${url('/get-involved')})
- [Contact](${url('/contact')})
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
