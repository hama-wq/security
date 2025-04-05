// src/app/utils/supabase/server.ts
import { supabase } from '../../lib/supabaseClient';

export async function getServerSideProps() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    return { props: { error: error.message } };
  }

  return { props: { users: data } };
}
