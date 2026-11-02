import type { ReactNode } from 'react';

import { Section } from '@/components/ui/section';
import {
  AWARDED_GRANTS,
  DONATION_SUMMARIES,
  FINANCIALS_AS_OF,
  FINANCIALS_TITLE,
  formatUsd,
  PENDING_GRANT_REQUESTS,
  sumAmounts,
  type AwardedGrant,
  type DonationSummary,
  type PendingGrantRequest,
} from '@/lib/content/financials';

function FinanceTable({
  caption,
  note,
  columns,
  rows,
  total,
}: {
  caption: string;
  note?: string;
  columns: string[];
  rows: ReactNode[][];
  total: { label: string; value: string };
}) {
  return (
    <div className='mt-8 overflow-x-auto'>
      <table className='w-full min-w-[32rem] border-collapse rounded-xl bg-white text-left shadow-sm'>
        <caption className='mb-2 text-left'>
          <span className='block text-xl font-bold text-navy'>{caption}</span>
          {note && (
            <span className='mt-1 block text-sm text-gray-700'>{note}</span>
          )}
        </caption>
        <thead>
          <tr className='border-b border-gray-300 text-sm text-gray-700'>
            {columns.map((column) => (
              <th key={column} scope='col' className='px-4 py-3 font-semibold'>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, index) => (
            <tr key={index} className='border-b border-gray-200 text-ink'>
              {cells.map((cell, i) => (
                <td key={i} className='px-4 py-3'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className='font-bold text-navy'>
            <th scope='row' colSpan={columns.length - 1} className='px-4 py-3'>
              {total.label}
            </th>
            <td className='px-4 py-3'>{total.value}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

type FinancialTransparencySectionProps = {
  awarded?: readonly AwardedGrant[];
  donations?: readonly DonationSummary[];
  pending?: readonly PendingGrantRequest[];
  asOf?: string | null;
};

/**
 * Awarded grants, donations, and pending requests in three separate tables
 * with separate totals. Pending requests are never added to income.
 * Hidden until the client provides figures.
 */
export function FinancialTransparencySection({
  awarded = AWARDED_GRANTS,
  donations = DONATION_SUMMARIES,
  pending = PENDING_GRANT_REQUESTS,
  asOf = FINANCIALS_AS_OF,
}: FinancialTransparencySectionProps) {
  if (awarded.length + donations.length + pending.length === 0) return null;

  return (
    <Section
      id='financial-transparency'
      title={FINANCIALS_TITLE}
      tone='white'
      intro={
        asOf ? (
          <p>
            Figures as of{' '}
            <time dateTime={asOf}>
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'long',
                timeZone: 'UTC',
              }).format(new Date(`${asOf}T00:00:00Z`))}
            </time>
            .
          </p>
        ) : undefined
      }
    >
      {awarded.length > 0 && (
        <FinanceTable
          caption='Grants Awarded'
          columns={['Funder', 'Awarded', 'Purpose', 'Amount']}
          rows={awarded.map((g) => [
            g.funder,
            g.awarded,
            g.purpose ?? '—',
            formatUsd(g.amount),
          ])}
          total={{
            label: 'Total awarded',
            value: formatUsd(sumAmounts(awarded, (g) => g.amount)),
          }}
        />
      )}
      {donations.length > 0 && (
        <FinanceTable
          caption='Donations Received'
          columns={['Period', 'Notes', 'Amount']}
          rows={donations.map((d) => [
            d.period,
            d.note ?? '—',
            formatUsd(d.amount),
          ])}
          total={{
            label: 'Total donations',
            value: formatUsd(sumAmounts(donations, (d) => d.amount)),
          }}
        />
      )}
      {pending.length > 0 && (
        <FinanceTable
          caption='Pending Grant Requests'
          note='Submitted and awaiting a decision. These are not awarded funds and are not counted in the totals above.'
          columns={['Funder', 'Submitted', 'Purpose', 'Amount requested']}
          rows={pending.map((p) => [
            p.funder,
            p.submitted,
            p.purpose ?? '—',
            formatUsd(p.amountRequested),
          ])}
          total={{
            label: 'Total requested (pending)',
            value: formatUsd(sumAmounts(pending, (p) => p.amountRequested)),
          }}
        />
      )}
    </Section>
  );
}
