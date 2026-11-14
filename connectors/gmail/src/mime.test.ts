import { describe, expect, it } from 'vitest';
import {
  addressHeader,
  attachmentPart,
  buildMimeMessage,
  cleanHeaderText,
  encodeHeaderWord,
  formatMailAddress,
  isPrintableAscii,
  messageIdList,
  mimeHeaderLines,
  parseAddressList,
  parseMailAddress,
  parseRecipients,
  safeMimeType,
  splitAddressList,
  textPart,
  toRawMessage,
  wrapBase64,
  type OutgoingEmail,
} from './mime.js';

const EMAIL: OutgoingEmail = {
  to: [{ name: 'Ana', email: 'ana@example.com' }],
  cc: [],
  bcc: [],
  subject: 'Olá',
  body: 'line 1\nline 2',
  inReplyTo: null,
  references: null,
  attachments: [],
};

/** Decodes the base64 body of a simple message (what follows the blank line). */
function decodeBody(mime: string): string {
  const body = mime.slice(mime.indexOf('\r\n\r\n') + 4).replace(/\r\n/g, '');
  return Buffer.from(body, 'base64').toString('utf8');
}

describe('addresses', () => {
  it('splitAddressList honors quotes and <>', () => {
    expect(splitAddressList('"Silva, Ana" <ana@x.com>, b@x.com; <c@x.com>')).toEqual([
      '"Silva, Ana" <ana@x.com>',
      'b@x.com',
      '<c@x.com>',
    ]);
    expect(splitAddressList('"a \\" , b" <a@x.com>')).toEqual(['"a \\" , b" <a@x.com>']);
    expect(splitAddressList(' , ')).toEqual([]);
  });

  it('parseMailAddress reads name and email and rejects invalid ones', () => {
    expect(parseMailAddress('"Silva, Ana" <ana@x.com>')).toEqual({
      name: 'Silva, Ana',
      email: 'ana@x.com',
    });
    expect(parseMailAddress('Bob <bob@x.com>')).toEqual({ name: 'Bob', email: 'bob@x.com' });
    expect(parseMailAddress(' c@x.com ')).toEqual({ name: '', email: 'c@x.com' });
    expect(parseMailAddress('no at sign')).toBeNull();
    expect(parseMailAddress('a@x.com\r\nBcc: z@x.com')).toBeNull();
  });

  it('parseAddressList drops invalid items', () => {
    expect(parseAddressList('Ana <ana@x.com>, junk')).toEqual([
      { name: 'Ana', email: 'ana@x.com' },
    ]);
  });

  it('parseRecipients accepts a list and throws naming the invalid item', () => {
    expect(parseRecipients(['a@x.com, B <b@x.com>'], 'to')).toHaveLength(2);
    expect(() => parseRecipients(['a@x.com', 'bad'], 'cc')).toThrow(/cc.*"bad"/);
  });

  it('formatMailAddress escapes quotes and encodes non-ASCII names', () => {
    expect(formatMailAddress({ name: '', email: 'a@x.com' })).toBe('a@x.com');
    expect(formatMailAddress({ name: 'A "B"', email: 'a@x.com' })).toBe('"A \\"B\\"" <a@x.com>');
    expect(formatMailAddress({ name: 'João', email: 'j@x.com' })).toBe(
      `${encodeHeaderWord('João')} <j@x.com>`,
    );
  });

  it('addressHeader omits empty lists', () => {
    expect(addressHeader('Cc', [])).toEqual([]);
    expect(addressHeader('To', EMAIL.to)).toEqual(['To: "Ana" <ana@example.com>']);
  });
});

describe('headers', () => {
  it('cleanHeaderText replaces breaks and tabs with a space (no header injection)', () => {
    expect(cleanHeaderText(' a\r\nBcc: x@y.com\tb ')).toBe('a Bcc: x@y.com b');
  });

  it('isPrintableAscii', () => {
    expect(isPrintableAscii('Olá')).toBe(false);
    expect(isPrintableAscii('Hello!')).toBe(true);
  });

  it('encodeHeaderWord keeps ASCII and encodes UTF-8 in short words', () => {
    expect(encodeHeaderWord('Receipt')).toBe('Receipt');
    expect(encodeHeaderWord('Olá')).toBe(`=?UTF-8?B?${Buffer.from('Olá').toString('base64')}?=`);
    const long = encodeHeaderWord('ç'.repeat(60));
    const words = long.split('\r\n ');
    expect(words.length).toBeGreaterThan(1);
    for (const word of words) expect(word.length).toBeLessThanOrEqual(75);
    const decoded = words
      .map((w) => Buffer.from(w.slice(10, -2), 'base64').toString('utf8'))
      .join('');
    expect(decoded).toBe('ç'.repeat(60));
  });

  it('messageIdList keeps only ids in <>', () => {
    expect(messageIdList('<a@x> junk\r\nBcc: <b@y>')).toBe('<a@x> <b@y>');
    expect(messageIdList('')).toBeNull();
    expect(messageIdList(undefined)).toBeNull();
  });

  it('mimeHeaderLines includes recipients, subject and threading', () => {
    const lines = mimeHeaderLines({
      ...EMAIL,
      cc: [{ name: '', email: 'c@x.com' }],
      bcc: [{ name: '', email: 'b@x.com' }],
      subject: 'Re: hi\r\nX: y',
      inReplyTo: '<m1@x>',
      references: '<m0@x> <m1@x>',
    });
    expect(lines).toEqual([
      'MIME-Version: 1.0',
      'To: "Ana" <ana@example.com>',
      'Cc: c@x.com',
      'Bcc: b@x.com',
      'Subject: Re: hi X: y',
      'In-Reply-To: <m1@x>',
      'References: <m0@x> <m1@x>',
    ]);
  });
});

describe('body and attachments', () => {
  it('wrapBase64 wraps at 76-character lines', () => {
    const lines = wrapBase64(new Uint8Array(100)).split('\r\n');
    expect(lines[0]).toHaveLength(76);
    expect(lines.join('')).toBe(Buffer.alloc(100).toString('base64'));
  });

  it('textPart uses base64 UTF-8 with CRLF', () => {
    const part = textPart('a\nb');
    expect(part[0]).toBe('Content-Type: text/plain; charset="UTF-8"');
    expect(Buffer.from(part[3] ?? '', 'base64').toString()).toBe('a\r\nb');
  });

  it('safeMimeType rejects odd types', () => {
    expect(safeMimeType('application/pdf')).toBe('application/pdf');
    expect(safeMimeType('text/html\r\nX: y')).toBe('application/octet-stream');
  });

  it('attachmentPart cleans the name and encodes non-ASCII', () => {
    const part = attachmentPart({
      filename: 're"ci\r\nbo.pdf',
      mimeType: 'application/pdf',
      data: new Uint8Array([1, 2, 3]),
    });
    expect(part.slice(0, 3)).toEqual([
      'Content-Type: application/pdf; name="reci bo.pdf"',
      'Content-Disposition: attachment; filename="reci bo.pdf"',
      'Content-Transfer-Encoding: base64',
    ]);
    const accent = attachmentPart({
      filename: 'ação.pdf',
      mimeType: 'x/y',
      data: new Uint8Array(),
    });
    expect(accent[0]).toContain(encodeHeaderWord('ação.pdf'));
  });
});

describe('buildMimeMessage', () => {
  it('simple message: headers, blank line and base64 body', () => {
    const mime = buildMimeMessage(EMAIL, 'B');
    expect(mime).toContain('Subject: =?UTF-8?B?');
    expect(mime).toContain('Content-Type: text/plain; charset="UTF-8"');
    expect(mime).not.toContain('multipart');
    expect(decodeBody(mime)).toBe('line 1\r\nline 2');
  });

  it('with attachments becomes multipart/mixed with the given boundary', () => {
    const mime = buildMimeMessage(
      {
        ...EMAIL,
        attachments: [{ filename: 'a.txt', mimeType: 'text/plain', data: Buffer.from('hi') }],
      },
      '=_b1',
    );
    expect(mime).toContain('Content-Type: multipart/mixed; boundary="=_b1"');
    expect(mime.match(/^--=_b1$/gm)).toHaveLength(2);
    expect(mime.trimEnd().endsWith('--=_b1--')).toBe(true);
    expect(mime).toContain('filename="a.txt"');
  });

  it('toRawMessage encodes in base64url', () => {
    expect(Buffer.from(toRawMessage('To: a\r\n\r\n?>'), 'base64url').toString()).toBe(
      'To: a\r\n\r\n?>',
    );
  });
});
