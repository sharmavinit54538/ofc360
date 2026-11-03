/**
 * @file calendarIcsGenerator.ts
 * @description RFC 5545 compliant iCalendar (.ics) generator for recruitment
 * interview events and candidate self-booking confirmations.
 */

export interface CalendarEventDetails {
  title: string;
  description?: string;
  startTime: string; // ISO 8601 string or Date parseable
  endTime: string;   // ISO 8601 string or Date parseable
  location?: string;
  meetingUrl?: string;
  organizerName?: string;
  organizerEmail?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  timezone?: string;
}

/**
 * Formats a Date object to RFC 5545 UTC timestamp format (YYYYMMDDTHHMMSSZ).
 */
function formatToIcsDate(dateString: string): string {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) {
    // Return a safe fallback timestamp
    return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Escapes characters for iCalendar text values according to RFC 5545 section 3.3.11.
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates an RFC 5545 standard .ics file string for an interview round.
 */
export function generateInterviewIcs(details: CalendarEventDetails): string {
  const uid = `ofc360-interview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@ofc360.com`;
  const dtStamp = formatToIcsDate(new Date().toISOString());
  const dtStart = formatToIcsDate(details.startTime);
  const dtEnd = formatToIcsDate(details.endTime);

  const summary = escapeIcsText(details.title || 'Interview Session');
  const description = escapeIcsText(
    `${details.description || 'OFC360 Interview Round'}${
      details.meetingUrl ? `\\n\\nMeeting Link: ${details.meetingUrl}` : ''
    }`
  );
  const location = escapeIcsText(details.meetingUrl || details.location || 'Online');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OFC360//Recruitment Interview Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
  ];

  if (details.organizerEmail) {
    const orgName = details.organizerName ? `CN=${escapeIcsText(details.organizerName)}:` : ':';
    lines.push(`ORGANIZER;${orgName}mailto:${details.organizerEmail}`);
  }

  if (details.attendeeEmail) {
    const attName = details.attendeeName ? `CN=${escapeIcsText(details.attendeeName)}:` : ':';
    lines.push(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;${attName}mailto:${details.attendeeEmail}`);
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Triggers a client-side browser file download for the generated .ics file.
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
