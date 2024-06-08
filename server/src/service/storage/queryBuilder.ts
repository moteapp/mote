interface QueryContainer<T> {
    fields: string[];
    columns: Column[];
    from: string;
    where: {[key:string]: any}[];
    orderBy: string;
    limit: number;
    table: string;
}

interface Column {
    field: string;
    value: any;
    forceUpdate: boolean;
}

type STAR = "*";

export class QueryBuilder<T> {

    container: Partial<QueryContainer<T>> & {columns: Column[]} = {
        columns: []
    };

    static builder<T>() {
        return new QueryBuilder<T>();
    }

    get fields() {
        return this.container.columns.map(column=>column.field)
    }

    get args() {
        return this.container.columns.map(column=>null == column.value ? "NULL" : column.value);
    }

    get updateArgs() {
        return this.container.columns
            .filter(column=>column.forceUpdate || Boolean(column.value))
            .map(column=>null == column.value ? "NULL" : column.value);
    }

    select(field: keyof T | STAR){
        return this.column(field as any, null);
    }

    update(table: string) {
        this.container.table = table;
        return this;
    }

    insert(table: string) {
        this.container.table = table;
        return this;
    }

    updateColumn(field: keyof T, value?: any) {
        return this.column(field, value, false);
    }

    column(field: keyof T | '*', value?: any, forceUpdate=true) {
        this.container.columns.push({
            field: field as string,
            value: value,
            forceUpdate: forceUpdate
        });
        return this;
    }

    from(from: string) {
        this.container.from = from;
        return this;
    }

    where(wherePart: {[key:string]: any}) {
        const whereParts = this.container.where || []
        whereParts.push(wherePart)
        this.container.where = whereParts;
        return this;
    }

    orderBy(field: keyof T, arg:"DESC"|"ASC"="DESC") {
        this.container.orderBy = ` ORDER BY ${field.toString()} ${arg}`;
        return this;
    }

    limit(limit: number) {
        this.container.limit = limit;
        return this;
    }

    toInsertSql():[string, any[]] {
        let sql = `INSERT INTO ${this.container.table} ( ${this.fields.join(", ")} ) VALUES ( ${this.fields.map(()=>"?").join(", ")} )`;
        return [sql, this.args];
    }

    toInsertOrUpdateSql():[string, any[]] {
        let insertSql = `INSERT INTO ${this.container.table} ( ${this.fields.join(", ")} ) VALUES ( ${this.fields.map(()=>"?").join(", ")} )`;
        const updateArgs: any[] = [];
        const updateColumns = this.container.columns
            .filter(column=>column.forceUpdate)
            .map(column=>{
                updateArgs.push(column.value);
                return `${column.field} = ?`
            })
        let updateSql = ` ON DUPLICATE KEY UPDATE ${updateColumns.join(", ")}`
        const args = Object.assign([], this.args);
        args.push(...updateArgs);
        return [insertSql+updateSql, args];
    }

    toUpdateSql():[string, any[]] {
        if (null == this.container.where || this.container.where.length == 0) {
            throw new Error("Where statement could not be empty");
        }

        const updateColumns = this.container.columns
            .filter(column=>column.forceUpdate || Boolean(column.value))
            .map(column=>column.field)
            .map(field=> `${field} = ?`)
        const [whereSql, whereArgs] = this.buildWhereSql();
        let sql = `UPDATE ${this.container.table} SET ${updateColumns.join(", ")} WHERE ${whereSql}`;
        if (this.container.limit) {
            sql += ` LIMIT ${this.container.limit}`
        }
        const args = Object.assign([], this.updateArgs);
        args.push(...whereArgs);
        return [sql, args];
    }

    toSelectSql():[string, any[]] {
        if (null == this.container.where || this.container.where.length == 0) {
            throw new Error("Where statement could not be empty");
        }
        const [whereSql, args] = this.buildWhereSql();
        let sql = `SELECT ${this.fields.join()} FROM ${this.container.from} WHERE ${whereSql}`;
        if (this.container.orderBy) {
            sql += this.container.orderBy;
        }
        this.container.limit = this.container.limit ?? 100;
        if (this.container.limit) {
            sql += ` LIMIT ${this.container.limit}`
        }
        return [sql, args];
    }

    toCountSql():[string, any[]] {
        if (null == this.container.where || this.container.where.length == 0) {
            throw new Error("Where statement could not be empty");
        }
        const [whereSql, args] = this.buildWhereSql();
        let sql = `SELECT count(*) as count FROM ${this.container.from} WHERE ${whereSql}`;
        return [sql, args];
    }

    buildWhereSql():[string, any[]] {
        const whereParts: string[] = [];
        const args: any[] = [];
        this.container.where!.map(wherePart=>{
            for(const key in wherePart) {
                const value = wherePart[key]
                if (null == value) {
                    continue
                }
                const condition = `${key} = ?`
                args.push(value)
                whereParts.push(condition)
            }
        })
        return [whereParts.join(" AND "), args]
    }
}