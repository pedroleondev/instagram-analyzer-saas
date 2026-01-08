
import { createClient } from '@supabase/supabase-js';
import { InstagramProfile } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const saveLeadsToDB = async (profiles: InstagramProfile[]) => {
  const dataToSave = profiles.map(p => ({
    url: p.url,
    username: p.username,
    full_name: p.fullName,
    status_bio: p.biography, // ✅ Corrigido: campo correto é 'status_bio'
    followers_count: p.followersCount,
    is_verified: p.isVerified,
    niche: p.niche,
    has_posted_recently: p.hasPostedRecently,
    last_post_date: p.lastPostDate,
    profile_pic_url: p.profilePicUrl || null, // ✅ Adicionado campo faltante
  }));

  const { data, error } = await supabase
    .from('insta_leads')
    .upsert(dataToSave, { onConflict: 'url' });

  if (error) {
    console.error('❌ Erro ao salvar no Supabase:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    return false;
  }

  console.log('✅ Dados salvos com sucesso no Supabase:', data);
  return true;
};

export const fetchLeadsFromDB = async (): Promise<InstagramProfile[]> => {
  const { data, error } = await supabase
    .from('insta_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao buscar do Supabase:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('ℹ️ Nenhum dado encontrado no Supabase');
    return [];
  }

  console.log(`✅ ${data.length} leads carregados do Supabase`);

  return data.map(row => ({
    id: row.id,
    url: row.url,
    fullName: row.full_name || '',
    username: row.username || '',
    biography: row.status_bio || '', // ✅ Corrigido: campo correto é 'status_bio'
    followersCount: Number(row.followers_count) || 0,
    isVerified: row.is_verified || false,
    niche: row.niche || 'Não Categorizado', // ✅ Valor padrão em português
    hasPostedRecently: row.has_posted_recently || false,
    lastPostDate: row.last_post_date,
    profilePicUrl: row.profile_pic_url || undefined, // ✅ Adicionado campo faltante
    status: 'completed'
  }));
};
