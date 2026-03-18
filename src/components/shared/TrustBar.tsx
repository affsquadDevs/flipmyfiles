import { useTranslations } from 'next-intl';

const icons = [
  (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
];

const colors = [
  { lightColor: 'bg-violet-100 text-violet-600', darkColor: 'bg-violet-500/20 text-violet-400' },
  { lightColor: 'bg-blue-100 text-blue-600', darkColor: 'bg-blue-500/20 text-blue-400' },
  { lightColor: 'bg-green-100 text-green-600', darkColor: 'bg-green-500/20 text-green-400' },
];

const keys = ['secure', 'autoDelete', 'noSignup'] as const;

export default function TrustBar({ dark = false }: { dark?: boolean }) {
  const t = useTranslations('trustBar');

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
      {keys.map((key, i) => (
        <div key={key} className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${dark ? colors[i].darkColor : colors[i].lightColor}`}>
            {icons[i]}
          </div>
          <div>
            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{t(`${key}.title`)}</p>
            <p className={`text-xs ${dark ? 'text-gray-400' : 'text-text-muted'}`}>{t(`${key}.desc`)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
