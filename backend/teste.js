import sql from './db.js';

async function verificarTabelas() {
    console.log("🔍 Verificando tabelas no banco...");

    try {
        const tabelas = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        if (tabelas.length === 0) {
            console.log("⚠️ O banco está conectado, mas VAZIO. Nenhuma tabela encontrada.");
            console.log("👉 Você precisa voltar no site do Supabase e rodar o script SQL.");
        } else {
            console.log("✅ Tabelas encontradas com sucesso:");
            tabelas.forEach(t => console.log(` - ${t.table_name}`));
        }
        
    } catch (erro) {
        console.error("❌ Erro:", erro.message);
    } finally {
        // Essa linha encerra a conexão e libera o terminal
        await sql.end();
    }
}

verificarTabelas();