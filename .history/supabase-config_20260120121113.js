// Supabase Configuration
// ⚠️ SUBSTITUA OS VALORES ABAIXO COM SUAS CREDENCIAIS DO SUPABASE
// Acesse https://supabase.com para criar um projeto

const SUPABASE_URL = "https://seu-projeto.supabase.co";
const SUPABASE_KEY = "seu-anon-key-aqui";

// Inicializa cliente Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Supabase iniciado com sucesso!');
