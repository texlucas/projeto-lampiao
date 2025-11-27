import sql from './db.js';

async function testeReal() {
    console.log("🚀 Iniciando Teste de Escrita e Leitura...");

    try {
        // --- PASSO 1: Criar uma Categoria de Teste ---
        // Precisamos de uma categoria para classificar a denúncia (Ex: 'Homofobia', 'Assédio')
        // O comando 'returning *' faz o banco devolver o dado que acabou de criar
        console.log("1️⃣  Criando categoria de teste...");
        
        const [categoria] = await sql`
            INSERT INTO CategoriaDenuncia (nome_categoria, descricao)
            VALUES ('Teste de Conexão', 'Categoria criada automaticamente pelo script de teste')
            ON CONFLICT (nome_categoria) DO UPDATE SET descricao = 'Categoria atualizada' -- Se já existir, não dá erro
            RETURNING id_categoria, nome_categoria
        `;
        
        console.log(`   > Categoria usada: ID ${categoria.id_categoria} - ${categoria.nome_categoria}`);

        // --- PASSO 2: Inserir uma Denúncia Anônima ---
        console.log("2️⃣  Simulando uma denúncia anônima...");
        
        const [novaDenuncia] = await sql`
            INSERT INTO Denuncia (
                tipo_denuncia, 
                descricao, 
                local_ocorrencia, 
                id_categoria, 
                anonima
            ) VALUES (
                'Teste de Sistema', 
                'Esta é uma denúncia de teste para validar o banco de dados.', 
                'Laboratório de Informática', 
                ${categoria.id_categoria}, 
                true
            )
            RETURNING id_denuncia, data_registro, status
        `;

        console.log("   > Denúncia gravada com sucesso!");
        console.log(`   > ID da Denúncia: ${novaDenuncia.id_denuncia}`);
        console.log(`   > Status Inicial: ${novaDenuncia.status}`);

        // --- PASSO 3: Ler o que acabamos de escrever ---
        console.log("3️⃣  Confirmando se o dado está lá mesmo...");
        
        const [confirmacao] = await sql`
            SELECT * FROM Denuncia WHERE id_denuncia = ${novaDenuncia.id_denuncia}
        `;

        if (confirmacao) {
            console.log("✅ TESTE FINALIZADO COM SUCESSO!");
            console.log("   O banco de dados está gravando e lendo perfeitamente.");
        } else {
            console.error("⚠️ O dado foi gravado, mas não consegui ler de volta. Estranho...");
        }

    } catch (erro) {
        console.error("❌ OCORREU UM ERRO:", erro.message);
    } finally {
        // Fecha a conexão
        await sql.end();
    }
}

testeReal();