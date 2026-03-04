import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'All File Conversions — FlipMyFiles',
};

export default async function ConvertPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect('/tools');
}
