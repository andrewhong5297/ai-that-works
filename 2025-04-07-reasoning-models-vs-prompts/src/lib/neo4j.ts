import neo4j, { type Driver, type Session } from 'neo4j-driver';

let driver: Driver | null = null;

function getNeo4jDriver() {
    if (!driver) {
        driver = neo4j.driver(
            'neo4j+s://demo.neo4jlabs.com:7687',
            neo4j.auth.basic('recommendations', 'recommendations')
        );
    }
    return driver;
}

export class Neo4jSession {
    private session: Session;

    constructor() {
        this.session = getNeo4jDriver().session({ database: 'recommendations' });
    }

    async run(query: string) {
        const result = await this.session.run(query);
        return result.records;
    }

    async close() {
        await this.session.close();
    }

    finalize() {
        this.close().catch(err => console.error('Error closing session:', err));
    }
}
