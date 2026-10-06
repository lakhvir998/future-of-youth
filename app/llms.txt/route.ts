import { HERO_HEADLINE, HERO_INTRO, MISSION_STATEMENT } from '@/lib/content';
import { ACADEMIC_INTERESTS, PROGRAM_PREFERENCES } from '@/lib/request-info';
import {
  getPaypalUrl,
  getSiteUrl,
  REQUEST_INFO_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/site';

export const dynamic = 'force-static';

// llms.txt (https://llmstxt.org): a plain-text summary for AI answer engines,
// built from the same copy the page renders.
export function GET() {
  const siteUrl = getSiteUrl();
  const paypalUrl = getPaypalUrl();
  const list = (items: readonly string[]) =>
    items.map((item) => `- ${item}`).join('\n');

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## ${HERO_HEADLINE}

${HERO_INTRO}

## Mission Statement

${MISSION_STATEMENT}

## Programs

${list(PROGRAM_PREFERENCES)}

## Academic Interests

${list(ACADEMIC_INTERESTS)}

## Links

- [Home](${new URL('/', siteUrl)})
- [Request Free Program Info](${new URL(`/#${REQUEST_INFO_ID}`, siteUrl)})${
    paypalUrl ? `\n- [Support the Youth](${paypalUrl})` : ''
  }
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
