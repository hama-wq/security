import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../../../next-i18next.config';

export async function getI18nProps(locale: string, namespaces: string[] = ['common']) {
  return {
    ...(await serverSideTranslations(locale, namespaces, nextI18NextConfig as any))
  };
}
