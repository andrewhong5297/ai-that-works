import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver | null = null;

export function getNeo4jDriver() {
    if (!driver) {
        driver = neo4j.driver(
            'neo4j+s://demo.neo4jlabs.com:7687',
            neo4j.auth.basic('recommendations', 'recommendations')
        );
    }
    return driver;
}

export async function queryNeo4j(query: string) {
    const session = getNeo4jDriver().session({ database: 'recommendations' });
    try {
        const result = await session.run(query);
        return result.records;
    } finally {
        await session.close();
    }
}