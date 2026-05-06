
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * ผู้ใช้ระบบ (Admin / เจ้าหน้าที่ประตู)
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Branch
 * สาขา / อาคาร
 */
export type Branch = $Result.DefaultSelection<Prisma.$BranchPayload>
/**
 * Model Gate
 * ประตู / จุดควบคุม
 */
export type Gate = $Result.DefaultSelection<Prisma.$GatePayload>
/**
 * Model Member
 * สมาชิก / ผู้ใช้บริการ
 */
export type Member = $Result.DefaultSelection<Prisma.$MemberPayload>
/**
 * Model QrToken
 * QR Token — หมดอายุทุกเที่ยงคืน
 */
export type QrToken = $Result.DefaultSelection<Prisma.$QrTokenPayload>
/**
 * Model QrPolicy
 * นโยบาย QR
 */
export type QrPolicy = $Result.DefaultSelection<Prisma.$QrPolicyPayload>
/**
 * Model AccessEvent
 * เหตุการณ์เข้า-ออก
 */
export type AccessEvent = $Result.DefaultSelection<Prisma.$AccessEventPayload>
/**
 * Model DeviceRegistry
 * ทะเบียนอุปกรณ์
 */
export type DeviceRegistry = $Result.DefaultSelection<Prisma.$DeviceRegistryPayload>
/**
 * Model IdCardSession
 * เซสชันอ่านบัตรประชาชน
 */
export type IdCardSession = $Result.DefaultSelection<Prisma.$IdCardSessionPayload>
/**
 * Model AuditLog
 * Audit Log
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  GATE_OFFICER: 'GATE_OFFICER',
  VIEWER: 'VIEWER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const MemberType: {
  STUDENT: 'STUDENT',
  STAFF: 'STAFF',
  FACULTY: 'FACULTY',
  EXTERNAL: 'EXTERNAL',
  GUEST: 'GUEST'
};

export type MemberType = (typeof MemberType)[keyof typeof MemberType]


export const MemberStatus: {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
  REVOKED: 'REVOKED'
};

export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus]


export const GateDirection: {
  IN: 'IN',
  OUT: 'OUT',
  BIDIRECTIONAL: 'BIDIRECTIONAL'
};

export type GateDirection = (typeof GateDirection)[keyof typeof GateDirection]


export const GateStatus: {
  ACTIVE: 'ACTIVE',
  MAINTENANCE: 'MAINTENANCE',
  DISABLED: 'DISABLED'
};

export type GateStatus = (typeof GateStatus)[keyof typeof GateStatus]


export const QrPurpose: {
  ENTRY: 'ENTRY',
  EXIT: 'EXIT'
};

export type QrPurpose = (typeof QrPurpose)[keyof typeof QrPurpose]


export const AccessSource: {
  QR_CODE: 'QR_CODE',
  ID_CARD: 'ID_CARD',
  MANUAL: 'MANUAL'
};

export type AccessSource = (typeof AccessSource)[keyof typeof AccessSource]


export const AccessDecision: {
  ALLOWED: 'ALLOWED',
  DENIED: 'DENIED'
};

export type AccessDecision = (typeof AccessDecision)[keyof typeof AccessDecision]


export const DeviceType: {
  QR_SCANNER: 'QR_SCANNER',
  KIOSK: 'KIOSK',
  ID_CARD_READER: 'ID_CARD_READER',
  MOBILE: 'MOBILE'
};

export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType]


export const DeviceStatus: {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  MAINTENANCE: 'MAINTENANCE',
  DECOMMISSIONED: 'DECOMMISSIONED'
};

export type DeviceStatus = (typeof DeviceStatus)[keyof typeof DeviceStatus]


export const IdCardReadStatus: {
  SUCCESS: 'SUCCESS',
  PARTIAL: 'PARTIAL',
  FAILED: 'FAILED',
  TIMEOUT: 'TIMEOUT'
};

export type IdCardReadStatus = (typeof IdCardReadStatus)[keyof typeof IdCardReadStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type MemberType = $Enums.MemberType

export const MemberType: typeof $Enums.MemberType

export type MemberStatus = $Enums.MemberStatus

export const MemberStatus: typeof $Enums.MemberStatus

export type GateDirection = $Enums.GateDirection

export const GateDirection: typeof $Enums.GateDirection

export type GateStatus = $Enums.GateStatus

export const GateStatus: typeof $Enums.GateStatus

export type QrPurpose = $Enums.QrPurpose

export const QrPurpose: typeof $Enums.QrPurpose

export type AccessSource = $Enums.AccessSource

export const AccessSource: typeof $Enums.AccessSource

export type AccessDecision = $Enums.AccessDecision

export const AccessDecision: typeof $Enums.AccessDecision

export type DeviceType = $Enums.DeviceType

export const DeviceType: typeof $Enums.DeviceType

export type DeviceStatus = $Enums.DeviceStatus

export const DeviceStatus: typeof $Enums.DeviceStatus

export type IdCardReadStatus = $Enums.IdCardReadStatus

export const IdCardReadStatus: typeof $Enums.IdCardReadStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.branch`: Exposes CRUD operations for the **Branch** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Branches
    * const branches = await prisma.branch.findMany()
    * ```
    */
  get branch(): Prisma.BranchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gate`: Exposes CRUD operations for the **Gate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gates
    * const gates = await prisma.gate.findMany()
    * ```
    */
  get gate(): Prisma.GateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.member`: Exposes CRUD operations for the **Member** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Members
    * const members = await prisma.member.findMany()
    * ```
    */
  get member(): Prisma.MemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.qrToken`: Exposes CRUD operations for the **QrToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QrTokens
    * const qrTokens = await prisma.qrToken.findMany()
    * ```
    */
  get qrToken(): Prisma.QrTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.qrPolicy`: Exposes CRUD operations for the **QrPolicy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QrPolicies
    * const qrPolicies = await prisma.qrPolicy.findMany()
    * ```
    */
  get qrPolicy(): Prisma.QrPolicyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accessEvent`: Exposes CRUD operations for the **AccessEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccessEvents
    * const accessEvents = await prisma.accessEvent.findMany()
    * ```
    */
  get accessEvent(): Prisma.AccessEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deviceRegistry`: Exposes CRUD operations for the **DeviceRegistry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeviceRegistries
    * const deviceRegistries = await prisma.deviceRegistry.findMany()
    * ```
    */
  get deviceRegistry(): Prisma.DeviceRegistryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.idCardSession`: Exposes CRUD operations for the **IdCardSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IdCardSessions
    * const idCardSessions = await prisma.idCardSession.findMany()
    * ```
    */
  get idCardSession(): Prisma.IdCardSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Branch: 'Branch',
    Gate: 'Gate',
    Member: 'Member',
    QrToken: 'QrToken',
    QrPolicy: 'QrPolicy',
    AccessEvent: 'AccessEvent',
    DeviceRegistry: 'DeviceRegistry',
    IdCardSession: 'IdCardSession',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "branch" | "gate" | "member" | "qrToken" | "qrPolicy" | "accessEvent" | "deviceRegistry" | "idCardSession" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Branch: {
        payload: Prisma.$BranchPayload<ExtArgs>
        fields: Prisma.BranchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BranchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BranchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          findFirst: {
            args: Prisma.BranchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BranchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          findMany: {
            args: Prisma.BranchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>[]
          }
          create: {
            args: Prisma.BranchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          createMany: {
            args: Prisma.BranchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BranchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>[]
          }
          delete: {
            args: Prisma.BranchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          update: {
            args: Prisma.BranchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          deleteMany: {
            args: Prisma.BranchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BranchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BranchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>[]
          }
          upsert: {
            args: Prisma.BranchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BranchPayload>
          }
          aggregate: {
            args: Prisma.BranchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBranch>
          }
          groupBy: {
            args: Prisma.BranchGroupByArgs<ExtArgs>
            result: $Utils.Optional<BranchGroupByOutputType>[]
          }
          count: {
            args: Prisma.BranchCountArgs<ExtArgs>
            result: $Utils.Optional<BranchCountAggregateOutputType> | number
          }
        }
      }
      Gate: {
        payload: Prisma.$GatePayload<ExtArgs>
        fields: Prisma.GateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>
          }
          findFirst: {
            args: Prisma.GateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>
          }
          findMany: {
            args: Prisma.GateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>[]
          }
          create: {
            args: Prisma.GateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>
          }
          createMany: {
            args: Prisma.GateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>[]
          }
          delete: {
            args: Prisma.GateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>
          }
          update: {
            args: Prisma.GateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>
          }
          deleteMany: {
            args: Prisma.GateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>[]
          }
          upsert: {
            args: Prisma.GateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GatePayload>
          }
          aggregate: {
            args: Prisma.GateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGate>
          }
          groupBy: {
            args: Prisma.GateGroupByArgs<ExtArgs>
            result: $Utils.Optional<GateGroupByOutputType>[]
          }
          count: {
            args: Prisma.GateCountArgs<ExtArgs>
            result: $Utils.Optional<GateCountAggregateOutputType> | number
          }
        }
      }
      Member: {
        payload: Prisma.$MemberPayload<ExtArgs>
        fields: Prisma.MemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          findFirst: {
            args: Prisma.MemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          findMany: {
            args: Prisma.MemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          create: {
            args: Prisma.MemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          createMany: {
            args: Prisma.MemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          delete: {
            args: Prisma.MemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          update: {
            args: Prisma.MemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          deleteMany: {
            args: Prisma.MemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>[]
          }
          upsert: {
            args: Prisma.MemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemberPayload>
          }
          aggregate: {
            args: Prisma.MemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMember>
          }
          groupBy: {
            args: Prisma.MemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemberCountArgs<ExtArgs>
            result: $Utils.Optional<MemberCountAggregateOutputType> | number
          }
        }
      }
      QrToken: {
        payload: Prisma.$QrTokenPayload<ExtArgs>
        fields: Prisma.QrTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QrTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QrTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          findFirst: {
            args: Prisma.QrTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QrTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          findMany: {
            args: Prisma.QrTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>[]
          }
          create: {
            args: Prisma.QrTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          createMany: {
            args: Prisma.QrTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QrTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>[]
          }
          delete: {
            args: Prisma.QrTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          update: {
            args: Prisma.QrTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          deleteMany: {
            args: Prisma.QrTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QrTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QrTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>[]
          }
          upsert: {
            args: Prisma.QrTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrTokenPayload>
          }
          aggregate: {
            args: Prisma.QrTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQrToken>
          }
          groupBy: {
            args: Prisma.QrTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<QrTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.QrTokenCountArgs<ExtArgs>
            result: $Utils.Optional<QrTokenCountAggregateOutputType> | number
          }
        }
      }
      QrPolicy: {
        payload: Prisma.$QrPolicyPayload<ExtArgs>
        fields: Prisma.QrPolicyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QrPolicyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QrPolicyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>
          }
          findFirst: {
            args: Prisma.QrPolicyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QrPolicyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>
          }
          findMany: {
            args: Prisma.QrPolicyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>[]
          }
          create: {
            args: Prisma.QrPolicyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>
          }
          createMany: {
            args: Prisma.QrPolicyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QrPolicyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>[]
          }
          delete: {
            args: Prisma.QrPolicyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>
          }
          update: {
            args: Prisma.QrPolicyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>
          }
          deleteMany: {
            args: Prisma.QrPolicyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QrPolicyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QrPolicyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>[]
          }
          upsert: {
            args: Prisma.QrPolicyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QrPolicyPayload>
          }
          aggregate: {
            args: Prisma.QrPolicyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQrPolicy>
          }
          groupBy: {
            args: Prisma.QrPolicyGroupByArgs<ExtArgs>
            result: $Utils.Optional<QrPolicyGroupByOutputType>[]
          }
          count: {
            args: Prisma.QrPolicyCountArgs<ExtArgs>
            result: $Utils.Optional<QrPolicyCountAggregateOutputType> | number
          }
        }
      }
      AccessEvent: {
        payload: Prisma.$AccessEventPayload<ExtArgs>
        fields: Prisma.AccessEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccessEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccessEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>
          }
          findFirst: {
            args: Prisma.AccessEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccessEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>
          }
          findMany: {
            args: Prisma.AccessEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>[]
          }
          create: {
            args: Prisma.AccessEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>
          }
          createMany: {
            args: Prisma.AccessEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccessEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>[]
          }
          delete: {
            args: Prisma.AccessEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>
          }
          update: {
            args: Prisma.AccessEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>
          }
          deleteMany: {
            args: Prisma.AccessEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccessEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccessEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>[]
          }
          upsert: {
            args: Prisma.AccessEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccessEventPayload>
          }
          aggregate: {
            args: Prisma.AccessEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccessEvent>
          }
          groupBy: {
            args: Prisma.AccessEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccessEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccessEventCountArgs<ExtArgs>
            result: $Utils.Optional<AccessEventCountAggregateOutputType> | number
          }
        }
      }
      DeviceRegistry: {
        payload: Prisma.$DeviceRegistryPayload<ExtArgs>
        fields: Prisma.DeviceRegistryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceRegistryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceRegistryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>
          }
          findFirst: {
            args: Prisma.DeviceRegistryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceRegistryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>
          }
          findMany: {
            args: Prisma.DeviceRegistryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>[]
          }
          create: {
            args: Prisma.DeviceRegistryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>
          }
          createMany: {
            args: Prisma.DeviceRegistryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceRegistryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>[]
          }
          delete: {
            args: Prisma.DeviceRegistryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>
          }
          update: {
            args: Prisma.DeviceRegistryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>
          }
          deleteMany: {
            args: Prisma.DeviceRegistryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceRegistryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeviceRegistryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>[]
          }
          upsert: {
            args: Prisma.DeviceRegistryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeviceRegistryPayload>
          }
          aggregate: {
            args: Prisma.DeviceRegistryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeviceRegistry>
          }
          groupBy: {
            args: Prisma.DeviceRegistryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceRegistryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceRegistryCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceRegistryCountAggregateOutputType> | number
          }
        }
      }
      IdCardSession: {
        payload: Prisma.$IdCardSessionPayload<ExtArgs>
        fields: Prisma.IdCardSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdCardSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdCardSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>
          }
          findFirst: {
            args: Prisma.IdCardSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdCardSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>
          }
          findMany: {
            args: Prisma.IdCardSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>[]
          }
          create: {
            args: Prisma.IdCardSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>
          }
          createMany: {
            args: Prisma.IdCardSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdCardSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>[]
          }
          delete: {
            args: Prisma.IdCardSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>
          }
          update: {
            args: Prisma.IdCardSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>
          }
          deleteMany: {
            args: Prisma.IdCardSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdCardSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IdCardSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>[]
          }
          upsert: {
            args: Prisma.IdCardSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdCardSessionPayload>
          }
          aggregate: {
            args: Prisma.IdCardSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdCardSession>
          }
          groupBy: {
            args: Prisma.IdCardSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdCardSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdCardSessionCountArgs<ExtArgs>
            result: $Utils.Optional<IdCardSessionCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    branch?: BranchOmit
    gate?: GateOmit
    member?: MemberOmit
    qrToken?: QrTokenOmit
    qrPolicy?: QrPolicyOmit
    accessEvent?: AccessEventOmit
    deviceRegistry?: DeviceRegistryOmit
    idCardSession?: IdCardSessionOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type BranchCountOutputType
   */

  export type BranchCountOutputType = {
    gates: number
  }

  export type BranchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gates?: boolean | BranchCountOutputTypeCountGatesArgs
  }

  // Custom InputTypes
  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchCountOutputType
     */
    select?: BranchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BranchCountOutputType without action
   */
  export type BranchCountOutputTypeCountGatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GateWhereInput
  }


  /**
   * Count Type GateCountOutputType
   */

  export type GateCountOutputType = {
    accessEvents: number
    devices: number
  }

  export type GateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accessEvents?: boolean | GateCountOutputTypeCountAccessEventsArgs
    devices?: boolean | GateCountOutputTypeCountDevicesArgs
  }

  // Custom InputTypes
  /**
   * GateCountOutputType without action
   */
  export type GateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GateCountOutputType
     */
    select?: GateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GateCountOutputType without action
   */
  export type GateCountOutputTypeCountAccessEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessEventWhereInput
  }

  /**
   * GateCountOutputType without action
   */
  export type GateCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceRegistryWhereInput
  }


  /**
   * Count Type MemberCountOutputType
   */

  export type MemberCountOutputType = {
    qrTokens: number
    accessEvents: number
    idCardSessions: number
  }

  export type MemberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    qrTokens?: boolean | MemberCountOutputTypeCountQrTokensArgs
    accessEvents?: boolean | MemberCountOutputTypeCountAccessEventsArgs
    idCardSessions?: boolean | MemberCountOutputTypeCountIdCardSessionsArgs
  }

  // Custom InputTypes
  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemberCountOutputType
     */
    select?: MemberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountQrTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QrTokenWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountAccessEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessEventWhereInput
  }

  /**
   * MemberCountOutputType without action
   */
  export type MemberCountOutputTypeCountIdCardSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdCardSessionWhereInput
  }


  /**
   * Count Type DeviceRegistryCountOutputType
   */

  export type DeviceRegistryCountOutputType = {
    idCardSessions: number
  }

  export type DeviceRegistryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    idCardSessions?: boolean | DeviceRegistryCountOutputTypeCountIdCardSessionsArgs
  }

  // Custom InputTypes
  /**
   * DeviceRegistryCountOutputType without action
   */
  export type DeviceRegistryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistryCountOutputType
     */
    select?: DeviceRegistryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeviceRegistryCountOutputType without action
   */
  export type DeviceRegistryCountOutputTypeCountIdCardSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdCardSessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    fullName: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    fullName: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    fullName: number
    role: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    fullName?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    fullName?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    fullName?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    fullName: string
    role: $Enums.UserRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    fullName?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "fullName" | "role" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      fullName: string
      role: $Enums.UserRole
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Branch
   */

  export type AggregateBranch = {
    _count: BranchCountAggregateOutputType | null
    _min: BranchMinAggregateOutputType | null
    _max: BranchMaxAggregateOutputType | null
  }

  export type BranchMinAggregateOutputType = {
    id: string | null
    code: string | null
    nameTh: string | null
    nameEn: string | null
    nameZh: string | null
    address: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type BranchMaxAggregateOutputType = {
    id: string | null
    code: string | null
    nameTh: string | null
    nameEn: string | null
    nameZh: string | null
    address: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type BranchCountAggregateOutputType = {
    id: number
    code: number
    nameTh: number
    nameEn: number
    nameZh: number
    address: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type BranchMinAggregateInputType = {
    id?: true
    code?: true
    nameTh?: true
    nameEn?: true
    nameZh?: true
    address?: true
    isActive?: true
    createdAt?: true
  }

  export type BranchMaxAggregateInputType = {
    id?: true
    code?: true
    nameTh?: true
    nameEn?: true
    nameZh?: true
    address?: true
    isActive?: true
    createdAt?: true
  }

  export type BranchCountAggregateInputType = {
    id?: true
    code?: true
    nameTh?: true
    nameEn?: true
    nameZh?: true
    address?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type BranchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Branch to aggregate.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Branches
    **/
    _count?: true | BranchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BranchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BranchMaxAggregateInputType
  }

  export type GetBranchAggregateType<T extends BranchAggregateArgs> = {
        [P in keyof T & keyof AggregateBranch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBranch[P]>
      : GetScalarType<T[P], AggregateBranch[P]>
  }




  export type BranchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BranchWhereInput
    orderBy?: BranchOrderByWithAggregationInput | BranchOrderByWithAggregationInput[]
    by: BranchScalarFieldEnum[] | BranchScalarFieldEnum
    having?: BranchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BranchCountAggregateInputType | true
    _min?: BranchMinAggregateInputType
    _max?: BranchMaxAggregateInputType
  }

  export type BranchGroupByOutputType = {
    id: string
    code: string
    nameTh: string
    nameEn: string
    nameZh: string
    address: string | null
    isActive: boolean
    createdAt: Date
    _count: BranchCountAggregateOutputType | null
    _min: BranchMinAggregateOutputType | null
    _max: BranchMaxAggregateOutputType | null
  }

  type GetBranchGroupByPayload<T extends BranchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BranchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BranchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BranchGroupByOutputType[P]>
            : GetScalarType<T[P], BranchGroupByOutputType[P]>
        }
      >
    >


  export type BranchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
    gates?: boolean | Branch$gatesArgs<ExtArgs>
    _count?: boolean | BranchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["branch"]>

  export type BranchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["branch"]>

  export type BranchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["branch"]>

  export type BranchSelectScalar = {
    id?: boolean
    code?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    address?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type BranchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "nameTh" | "nameEn" | "nameZh" | "address" | "isActive" | "createdAt", ExtArgs["result"]["branch"]>
  export type BranchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gates?: boolean | Branch$gatesArgs<ExtArgs>
    _count?: boolean | BranchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BranchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BranchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BranchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Branch"
    objects: {
      gates: Prisma.$GatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      nameTh: string
      nameEn: string
      nameZh: string
      address: string | null
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["branch"]>
    composites: {}
  }

  type BranchGetPayload<S extends boolean | null | undefined | BranchDefaultArgs> = $Result.GetResult<Prisma.$BranchPayload, S>

  type BranchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BranchCountAggregateInputType | true
    }

  export interface BranchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Branch'], meta: { name: 'Branch' } }
    /**
     * Find zero or one Branch that matches the filter.
     * @param {BranchFindUniqueArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BranchFindUniqueArgs>(args: SelectSubset<T, BranchFindUniqueArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Branch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BranchFindUniqueOrThrowArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BranchFindUniqueOrThrowArgs>(args: SelectSubset<T, BranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Branch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindFirstArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BranchFindFirstArgs>(args?: SelectSubset<T, BranchFindFirstArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Branch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindFirstOrThrowArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BranchFindFirstOrThrowArgs>(args?: SelectSubset<T, BranchFindFirstOrThrowArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Branches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Branches
     * const branches = await prisma.branch.findMany()
     * 
     * // Get first 10 Branches
     * const branches = await prisma.branch.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const branchWithIdOnly = await prisma.branch.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BranchFindManyArgs>(args?: SelectSubset<T, BranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Branch.
     * @param {BranchCreateArgs} args - Arguments to create a Branch.
     * @example
     * // Create one Branch
     * const Branch = await prisma.branch.create({
     *   data: {
     *     // ... data to create a Branch
     *   }
     * })
     * 
     */
    create<T extends BranchCreateArgs>(args: SelectSubset<T, BranchCreateArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Branches.
     * @param {BranchCreateManyArgs} args - Arguments to create many Branches.
     * @example
     * // Create many Branches
     * const branch = await prisma.branch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BranchCreateManyArgs>(args?: SelectSubset<T, BranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Branches and returns the data saved in the database.
     * @param {BranchCreateManyAndReturnArgs} args - Arguments to create many Branches.
     * @example
     * // Create many Branches
     * const branch = await prisma.branch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Branches and only return the `id`
     * const branchWithIdOnly = await prisma.branch.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BranchCreateManyAndReturnArgs>(args?: SelectSubset<T, BranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Branch.
     * @param {BranchDeleteArgs} args - Arguments to delete one Branch.
     * @example
     * // Delete one Branch
     * const Branch = await prisma.branch.delete({
     *   where: {
     *     // ... filter to delete one Branch
     *   }
     * })
     * 
     */
    delete<T extends BranchDeleteArgs>(args: SelectSubset<T, BranchDeleteArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Branch.
     * @param {BranchUpdateArgs} args - Arguments to update one Branch.
     * @example
     * // Update one Branch
     * const branch = await prisma.branch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BranchUpdateArgs>(args: SelectSubset<T, BranchUpdateArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Branches.
     * @param {BranchDeleteManyArgs} args - Arguments to filter Branches to delete.
     * @example
     * // Delete a few Branches
     * const { count } = await prisma.branch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BranchDeleteManyArgs>(args?: SelectSubset<T, BranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Branches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Branches
     * const branch = await prisma.branch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BranchUpdateManyArgs>(args: SelectSubset<T, BranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Branches and returns the data updated in the database.
     * @param {BranchUpdateManyAndReturnArgs} args - Arguments to update many Branches.
     * @example
     * // Update many Branches
     * const branch = await prisma.branch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Branches and only return the `id`
     * const branchWithIdOnly = await prisma.branch.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BranchUpdateManyAndReturnArgs>(args: SelectSubset<T, BranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Branch.
     * @param {BranchUpsertArgs} args - Arguments to update or create a Branch.
     * @example
     * // Update or create a Branch
     * const branch = await prisma.branch.upsert({
     *   create: {
     *     // ... data to create a Branch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Branch we want to update
     *   }
     * })
     */
    upsert<T extends BranchUpsertArgs>(args: SelectSubset<T, BranchUpsertArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Branches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchCountArgs} args - Arguments to filter Branches to count.
     * @example
     * // Count the number of Branches
     * const count = await prisma.branch.count({
     *   where: {
     *     // ... the filter for the Branches we want to count
     *   }
     * })
    **/
    count<T extends BranchCountArgs>(
      args?: Subset<T, BranchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BranchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Branch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BranchAggregateArgs>(args: Subset<T, BranchAggregateArgs>): Prisma.PrismaPromise<GetBranchAggregateType<T>>

    /**
     * Group by Branch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BranchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BranchGroupByArgs['orderBy'] }
        : { orderBy?: BranchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Branch model
   */
  readonly fields: BranchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Branch.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BranchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gates<T extends Branch$gatesArgs<ExtArgs> = {}>(args?: Subset<T, Branch$gatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Branch model
   */
  interface BranchFieldRefs {
    readonly id: FieldRef<"Branch", 'String'>
    readonly code: FieldRef<"Branch", 'String'>
    readonly nameTh: FieldRef<"Branch", 'String'>
    readonly nameEn: FieldRef<"Branch", 'String'>
    readonly nameZh: FieldRef<"Branch", 'String'>
    readonly address: FieldRef<"Branch", 'String'>
    readonly isActive: FieldRef<"Branch", 'Boolean'>
    readonly createdAt: FieldRef<"Branch", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Branch findUnique
   */
  export type BranchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch findUniqueOrThrow
   */
  export type BranchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch findFirst
   */
  export type BranchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Branches.
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Branches.
     */
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * Branch findFirstOrThrow
   */
  export type BranchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branch to fetch.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Branches.
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Branches.
     */
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * Branch findMany
   */
  export type BranchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter, which Branches to fetch.
     */
    where?: BranchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Branches to fetch.
     */
    orderBy?: BranchOrderByWithRelationInput | BranchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Branches.
     */
    cursor?: BranchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Branches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Branches.
     */
    distinct?: BranchScalarFieldEnum | BranchScalarFieldEnum[]
  }

  /**
   * Branch create
   */
  export type BranchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * The data needed to create a Branch.
     */
    data: XOR<BranchCreateInput, BranchUncheckedCreateInput>
  }

  /**
   * Branch createMany
   */
  export type BranchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Branches.
     */
    data: BranchCreateManyInput | BranchCreateManyInput[]
  }

  /**
   * Branch createManyAndReturn
   */
  export type BranchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * The data used to create many Branches.
     */
    data: BranchCreateManyInput | BranchCreateManyInput[]
  }

  /**
   * Branch update
   */
  export type BranchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * The data needed to update a Branch.
     */
    data: XOR<BranchUpdateInput, BranchUncheckedUpdateInput>
    /**
     * Choose, which Branch to update.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch updateMany
   */
  export type BranchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Branches.
     */
    data: XOR<BranchUpdateManyMutationInput, BranchUncheckedUpdateManyInput>
    /**
     * Filter which Branches to update
     */
    where?: BranchWhereInput
    /**
     * Limit how many Branches to update.
     */
    limit?: number
  }

  /**
   * Branch updateManyAndReturn
   */
  export type BranchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * The data used to update Branches.
     */
    data: XOR<BranchUpdateManyMutationInput, BranchUncheckedUpdateManyInput>
    /**
     * Filter which Branches to update
     */
    where?: BranchWhereInput
    /**
     * Limit how many Branches to update.
     */
    limit?: number
  }

  /**
   * Branch upsert
   */
  export type BranchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * The filter to search for the Branch to update in case it exists.
     */
    where: BranchWhereUniqueInput
    /**
     * In case the Branch found by the `where` argument doesn't exist, create a new Branch with this data.
     */
    create: XOR<BranchCreateInput, BranchUncheckedCreateInput>
    /**
     * In case the Branch was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BranchUpdateInput, BranchUncheckedUpdateInput>
  }

  /**
   * Branch delete
   */
  export type BranchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
    /**
     * Filter which Branch to delete.
     */
    where: BranchWhereUniqueInput
  }

  /**
   * Branch deleteMany
   */
  export type BranchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Branches to delete
     */
    where?: BranchWhereInput
    /**
     * Limit how many Branches to delete.
     */
    limit?: number
  }

  /**
   * Branch.gates
   */
  export type Branch$gatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    where?: GateWhereInput
    orderBy?: GateOrderByWithRelationInput | GateOrderByWithRelationInput[]
    cursor?: GateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GateScalarFieldEnum | GateScalarFieldEnum[]
  }

  /**
   * Branch without action
   */
  export type BranchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: BranchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Branch
     */
    omit?: BranchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BranchInclude<ExtArgs> | null
  }


  /**
   * Model Gate
   */

  export type AggregateGate = {
    _count: GateCountAggregateOutputType | null
    _min: GateMinAggregateOutputType | null
    _max: GateMaxAggregateOutputType | null
  }

  export type GateMinAggregateOutputType = {
    id: string | null
    gateCode: string | null
    nameTh: string | null
    nameEn: string | null
    nameZh: string | null
    branchId: string | null
    direction: $Enums.GateDirection | null
    status: $Enums.GateStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GateMaxAggregateOutputType = {
    id: string | null
    gateCode: string | null
    nameTh: string | null
    nameEn: string | null
    nameZh: string | null
    branchId: string | null
    direction: $Enums.GateDirection | null
    status: $Enums.GateStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GateCountAggregateOutputType = {
    id: number
    gateCode: number
    nameTh: number
    nameEn: number
    nameZh: number
    branchId: number
    direction: number
    status: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GateMinAggregateInputType = {
    id?: true
    gateCode?: true
    nameTh?: true
    nameEn?: true
    nameZh?: true
    branchId?: true
    direction?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GateMaxAggregateInputType = {
    id?: true
    gateCode?: true
    nameTh?: true
    nameEn?: true
    nameZh?: true
    branchId?: true
    direction?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GateCountAggregateInputType = {
    id?: true
    gateCode?: true
    nameTh?: true
    nameEn?: true
    nameZh?: true
    branchId?: true
    direction?: true
    status?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gate to aggregate.
     */
    where?: GateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gates to fetch.
     */
    orderBy?: GateOrderByWithRelationInput | GateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Gates
    **/
    _count?: true | GateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GateMaxAggregateInputType
  }

  export type GetGateAggregateType<T extends GateAggregateArgs> = {
        [P in keyof T & keyof AggregateGate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGate[P]>
      : GetScalarType<T[P], AggregateGate[P]>
  }




  export type GateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GateWhereInput
    orderBy?: GateOrderByWithAggregationInput | GateOrderByWithAggregationInput[]
    by: GateScalarFieldEnum[] | GateScalarFieldEnum
    having?: GateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GateCountAggregateInputType | true
    _min?: GateMinAggregateInputType
    _max?: GateMaxAggregateInputType
  }

  export type GateGroupByOutputType = {
    id: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    branchId: string
    direction: $Enums.GateDirection
    status: $Enums.GateStatus
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: GateCountAggregateOutputType | null
    _min: GateMinAggregateOutputType | null
    _max: GateMaxAggregateOutputType | null
  }

  type GetGateGroupByPayload<T extends GateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GateGroupByOutputType[P]>
            : GetScalarType<T[P], GateGroupByOutputType[P]>
        }
      >
    >


  export type GateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gateCode?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    branchId?: boolean
    direction?: boolean
    status?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    accessEvents?: boolean | Gate$accessEventsArgs<ExtArgs>
    devices?: boolean | Gate$devicesArgs<ExtArgs>
    _count?: boolean | GateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gate"]>

  export type GateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gateCode?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    branchId?: boolean
    direction?: boolean
    status?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    branch?: boolean | BranchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gate"]>

  export type GateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gateCode?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    branchId?: boolean
    direction?: boolean
    status?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    branch?: boolean | BranchDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gate"]>

  export type GateSelectScalar = {
    id?: boolean
    gateCode?: boolean
    nameTh?: boolean
    nameEn?: boolean
    nameZh?: boolean
    branchId?: boolean
    direction?: boolean
    status?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gateCode" | "nameTh" | "nameEn" | "nameZh" | "branchId" | "direction" | "status" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["gate"]>
  export type GateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | BranchDefaultArgs<ExtArgs>
    accessEvents?: boolean | Gate$accessEventsArgs<ExtArgs>
    devices?: boolean | Gate$devicesArgs<ExtArgs>
    _count?: boolean | GateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | BranchDefaultArgs<ExtArgs>
  }
  export type GateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    branch?: boolean | BranchDefaultArgs<ExtArgs>
  }

  export type $GatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Gate"
    objects: {
      branch: Prisma.$BranchPayload<ExtArgs>
      accessEvents: Prisma.$AccessEventPayload<ExtArgs>[]
      devices: Prisma.$DeviceRegistryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gateCode: string
      nameTh: string
      nameEn: string
      nameZh: string
      branchId: string
      direction: $Enums.GateDirection
      status: $Enums.GateStatus
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gate"]>
    composites: {}
  }

  type GateGetPayload<S extends boolean | null | undefined | GateDefaultArgs> = $Result.GetResult<Prisma.$GatePayload, S>

  type GateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GateCountAggregateInputType | true
    }

  export interface GateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gate'], meta: { name: 'Gate' } }
    /**
     * Find zero or one Gate that matches the filter.
     * @param {GateFindUniqueArgs} args - Arguments to find a Gate
     * @example
     * // Get one Gate
     * const gate = await prisma.gate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GateFindUniqueArgs>(args: SelectSubset<T, GateFindUniqueArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GateFindUniqueOrThrowArgs} args - Arguments to find a Gate
     * @example
     * // Get one Gate
     * const gate = await prisma.gate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GateFindUniqueOrThrowArgs>(args: SelectSubset<T, GateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateFindFirstArgs} args - Arguments to find a Gate
     * @example
     * // Get one Gate
     * const gate = await prisma.gate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GateFindFirstArgs>(args?: SelectSubset<T, GateFindFirstArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateFindFirstOrThrowArgs} args - Arguments to find a Gate
     * @example
     * // Get one Gate
     * const gate = await prisma.gate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GateFindFirstOrThrowArgs>(args?: SelectSubset<T, GateFindFirstOrThrowArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Gates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gates
     * const gates = await prisma.gate.findMany()
     * 
     * // Get first 10 Gates
     * const gates = await prisma.gate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gateWithIdOnly = await prisma.gate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GateFindManyArgs>(args?: SelectSubset<T, GateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gate.
     * @param {GateCreateArgs} args - Arguments to create a Gate.
     * @example
     * // Create one Gate
     * const Gate = await prisma.gate.create({
     *   data: {
     *     // ... data to create a Gate
     *   }
     * })
     * 
     */
    create<T extends GateCreateArgs>(args: SelectSubset<T, GateCreateArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Gates.
     * @param {GateCreateManyArgs} args - Arguments to create many Gates.
     * @example
     * // Create many Gates
     * const gate = await prisma.gate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GateCreateManyArgs>(args?: SelectSubset<T, GateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Gates and returns the data saved in the database.
     * @param {GateCreateManyAndReturnArgs} args - Arguments to create many Gates.
     * @example
     * // Create many Gates
     * const gate = await prisma.gate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Gates and only return the `id`
     * const gateWithIdOnly = await prisma.gate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GateCreateManyAndReturnArgs>(args?: SelectSubset<T, GateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Gate.
     * @param {GateDeleteArgs} args - Arguments to delete one Gate.
     * @example
     * // Delete one Gate
     * const Gate = await prisma.gate.delete({
     *   where: {
     *     // ... filter to delete one Gate
     *   }
     * })
     * 
     */
    delete<T extends GateDeleteArgs>(args: SelectSubset<T, GateDeleteArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gate.
     * @param {GateUpdateArgs} args - Arguments to update one Gate.
     * @example
     * // Update one Gate
     * const gate = await prisma.gate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GateUpdateArgs>(args: SelectSubset<T, GateUpdateArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Gates.
     * @param {GateDeleteManyArgs} args - Arguments to filter Gates to delete.
     * @example
     * // Delete a few Gates
     * const { count } = await prisma.gate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GateDeleteManyArgs>(args?: SelectSubset<T, GateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gates
     * const gate = await prisma.gate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GateUpdateManyArgs>(args: SelectSubset<T, GateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gates and returns the data updated in the database.
     * @param {GateUpdateManyAndReturnArgs} args - Arguments to update many Gates.
     * @example
     * // Update many Gates
     * const gate = await prisma.gate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Gates and only return the `id`
     * const gateWithIdOnly = await prisma.gate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GateUpdateManyAndReturnArgs>(args: SelectSubset<T, GateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Gate.
     * @param {GateUpsertArgs} args - Arguments to update or create a Gate.
     * @example
     * // Update or create a Gate
     * const gate = await prisma.gate.upsert({
     *   create: {
     *     // ... data to create a Gate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gate we want to update
     *   }
     * })
     */
    upsert<T extends GateUpsertArgs>(args: SelectSubset<T, GateUpsertArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Gates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateCountArgs} args - Arguments to filter Gates to count.
     * @example
     * // Count the number of Gates
     * const count = await prisma.gate.count({
     *   where: {
     *     // ... the filter for the Gates we want to count
     *   }
     * })
    **/
    count<T extends GateCountArgs>(
      args?: Subset<T, GateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GateAggregateArgs>(args: Subset<T, GateAggregateArgs>): Prisma.PrismaPromise<GetGateAggregateType<T>>

    /**
     * Group by Gate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GateGroupByArgs['orderBy'] }
        : { orderBy?: GateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Gate model
   */
  readonly fields: GateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Gate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    branch<T extends BranchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BranchDefaultArgs<ExtArgs>>): Prisma__BranchClient<$Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    accessEvents<T extends Gate$accessEventsArgs<ExtArgs> = {}>(args?: Subset<T, Gate$accessEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    devices<T extends Gate$devicesArgs<ExtArgs> = {}>(args?: Subset<T, Gate$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Gate model
   */
  interface GateFieldRefs {
    readonly id: FieldRef<"Gate", 'String'>
    readonly gateCode: FieldRef<"Gate", 'String'>
    readonly nameTh: FieldRef<"Gate", 'String'>
    readonly nameEn: FieldRef<"Gate", 'String'>
    readonly nameZh: FieldRef<"Gate", 'String'>
    readonly branchId: FieldRef<"Gate", 'String'>
    readonly direction: FieldRef<"Gate", 'GateDirection'>
    readonly status: FieldRef<"Gate", 'GateStatus'>
    readonly metadata: FieldRef<"Gate", 'Json'>
    readonly createdAt: FieldRef<"Gate", 'DateTime'>
    readonly updatedAt: FieldRef<"Gate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Gate findUnique
   */
  export type GateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * Filter, which Gate to fetch.
     */
    where: GateWhereUniqueInput
  }

  /**
   * Gate findUniqueOrThrow
   */
  export type GateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * Filter, which Gate to fetch.
     */
    where: GateWhereUniqueInput
  }

  /**
   * Gate findFirst
   */
  export type GateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * Filter, which Gate to fetch.
     */
    where?: GateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gates to fetch.
     */
    orderBy?: GateOrderByWithRelationInput | GateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gates.
     */
    cursor?: GateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gates.
     */
    distinct?: GateScalarFieldEnum | GateScalarFieldEnum[]
  }

  /**
   * Gate findFirstOrThrow
   */
  export type GateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * Filter, which Gate to fetch.
     */
    where?: GateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gates to fetch.
     */
    orderBy?: GateOrderByWithRelationInput | GateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gates.
     */
    cursor?: GateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gates.
     */
    distinct?: GateScalarFieldEnum | GateScalarFieldEnum[]
  }

  /**
   * Gate findMany
   */
  export type GateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * Filter, which Gates to fetch.
     */
    where?: GateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gates to fetch.
     */
    orderBy?: GateOrderByWithRelationInput | GateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Gates.
     */
    cursor?: GateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gates.
     */
    distinct?: GateScalarFieldEnum | GateScalarFieldEnum[]
  }

  /**
   * Gate create
   */
  export type GateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * The data needed to create a Gate.
     */
    data: XOR<GateCreateInput, GateUncheckedCreateInput>
  }

  /**
   * Gate createMany
   */
  export type GateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Gates.
     */
    data: GateCreateManyInput | GateCreateManyInput[]
  }

  /**
   * Gate createManyAndReturn
   */
  export type GateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * The data used to create many Gates.
     */
    data: GateCreateManyInput | GateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gate update
   */
  export type GateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * The data needed to update a Gate.
     */
    data: XOR<GateUpdateInput, GateUncheckedUpdateInput>
    /**
     * Choose, which Gate to update.
     */
    where: GateWhereUniqueInput
  }

  /**
   * Gate updateMany
   */
  export type GateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Gates.
     */
    data: XOR<GateUpdateManyMutationInput, GateUncheckedUpdateManyInput>
    /**
     * Filter which Gates to update
     */
    where?: GateWhereInput
    /**
     * Limit how many Gates to update.
     */
    limit?: number
  }

  /**
   * Gate updateManyAndReturn
   */
  export type GateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * The data used to update Gates.
     */
    data: XOR<GateUpdateManyMutationInput, GateUncheckedUpdateManyInput>
    /**
     * Filter which Gates to update
     */
    where?: GateWhereInput
    /**
     * Limit how many Gates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gate upsert
   */
  export type GateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * The filter to search for the Gate to update in case it exists.
     */
    where: GateWhereUniqueInput
    /**
     * In case the Gate found by the `where` argument doesn't exist, create a new Gate with this data.
     */
    create: XOR<GateCreateInput, GateUncheckedCreateInput>
    /**
     * In case the Gate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GateUpdateInput, GateUncheckedUpdateInput>
  }

  /**
   * Gate delete
   */
  export type GateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
    /**
     * Filter which Gate to delete.
     */
    where: GateWhereUniqueInput
  }

  /**
   * Gate deleteMany
   */
  export type GateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gates to delete
     */
    where?: GateWhereInput
    /**
     * Limit how many Gates to delete.
     */
    limit?: number
  }

  /**
   * Gate.accessEvents
   */
  export type Gate$accessEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    where?: AccessEventWhereInput
    orderBy?: AccessEventOrderByWithRelationInput | AccessEventOrderByWithRelationInput[]
    cursor?: AccessEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccessEventScalarFieldEnum | AccessEventScalarFieldEnum[]
  }

  /**
   * Gate.devices
   */
  export type Gate$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    where?: DeviceRegistryWhereInput
    orderBy?: DeviceRegistryOrderByWithRelationInput | DeviceRegistryOrderByWithRelationInput[]
    cursor?: DeviceRegistryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceRegistryScalarFieldEnum | DeviceRegistryScalarFieldEnum[]
  }

  /**
   * Gate without action
   */
  export type GateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gate
     */
    select?: GateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gate
     */
    omit?: GateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GateInclude<ExtArgs> | null
  }


  /**
   * Model Member
   */

  export type AggregateMember = {
    _count: MemberCountAggregateOutputType | null
    _min: MemberMinAggregateOutputType | null
    _max: MemberMaxAggregateOutputType | null
  }

  export type MemberMinAggregateOutputType = {
    id: string | null
    memberNo: string | null
    citizenId: string | null
    firstNameTh: string | null
    lastNameTh: string | null
    firstNameEn: string | null
    lastNameEn: string | null
    firstNameZh: string | null
    lastNameZh: string | null
    email: string | null
    phone: string | null
    memberType: $Enums.MemberType | null
    status: $Enums.MemberStatus | null
    expireDate: Date | null
    photo: Bytes | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MemberMaxAggregateOutputType = {
    id: string | null
    memberNo: string | null
    citizenId: string | null
    firstNameTh: string | null
    lastNameTh: string | null
    firstNameEn: string | null
    lastNameEn: string | null
    firstNameZh: string | null
    lastNameZh: string | null
    email: string | null
    phone: string | null
    memberType: $Enums.MemberType | null
    status: $Enums.MemberStatus | null
    expireDate: Date | null
    photo: Bytes | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MemberCountAggregateOutputType = {
    id: number
    memberNo: number
    citizenId: number
    firstNameTh: number
    lastNameTh: number
    firstNameEn: number
    lastNameEn: number
    firstNameZh: number
    lastNameZh: number
    email: number
    phone: number
    memberType: number
    status: number
    expireDate: number
    photo: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MemberMinAggregateInputType = {
    id?: true
    memberNo?: true
    citizenId?: true
    firstNameTh?: true
    lastNameTh?: true
    firstNameEn?: true
    lastNameEn?: true
    firstNameZh?: true
    lastNameZh?: true
    email?: true
    phone?: true
    memberType?: true
    status?: true
    expireDate?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MemberMaxAggregateInputType = {
    id?: true
    memberNo?: true
    citizenId?: true
    firstNameTh?: true
    lastNameTh?: true
    firstNameEn?: true
    lastNameEn?: true
    firstNameZh?: true
    lastNameZh?: true
    email?: true
    phone?: true
    memberType?: true
    status?: true
    expireDate?: true
    photo?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MemberCountAggregateInputType = {
    id?: true
    memberNo?: true
    citizenId?: true
    firstNameTh?: true
    lastNameTh?: true
    firstNameEn?: true
    lastNameEn?: true
    firstNameZh?: true
    lastNameZh?: true
    email?: true
    phone?: true
    memberType?: true
    status?: true
    expireDate?: true
    photo?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Member to aggregate.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Members
    **/
    _count?: true | MemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MemberMaxAggregateInputType
  }

  export type GetMemberAggregateType<T extends MemberAggregateArgs> = {
        [P in keyof T & keyof AggregateMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMember[P]>
      : GetScalarType<T[P], AggregateMember[P]>
  }




  export type MemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemberWhereInput
    orderBy?: MemberOrderByWithAggregationInput | MemberOrderByWithAggregationInput[]
    by: MemberScalarFieldEnum[] | MemberScalarFieldEnum
    having?: MemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemberCountAggregateInputType | true
    _min?: MemberMinAggregateInputType
    _max?: MemberMaxAggregateInputType
  }

  export type MemberGroupByOutputType = {
    id: string
    memberNo: string
    citizenId: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn: string | null
    lastNameEn: string | null
    firstNameZh: string | null
    lastNameZh: string | null
    email: string | null
    phone: string | null
    memberType: $Enums.MemberType
    status: $Enums.MemberStatus
    expireDate: Date | null
    photo: Bytes | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: MemberCountAggregateOutputType | null
    _min: MemberMinAggregateOutputType | null
    _max: MemberMaxAggregateOutputType | null
  }

  type GetMemberGroupByPayload<T extends MemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemberGroupByOutputType[P]>
            : GetScalarType<T[P], MemberGroupByOutputType[P]>
        }
      >
    >


  export type MemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberNo?: boolean
    citizenId?: boolean
    firstNameTh?: boolean
    lastNameTh?: boolean
    firstNameEn?: boolean
    lastNameEn?: boolean
    firstNameZh?: boolean
    lastNameZh?: boolean
    email?: boolean
    phone?: boolean
    memberType?: boolean
    status?: boolean
    expireDate?: boolean
    photo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    qrTokens?: boolean | Member$qrTokensArgs<ExtArgs>
    accessEvents?: boolean | Member$accessEventsArgs<ExtArgs>
    idCardSessions?: boolean | Member$idCardSessionsArgs<ExtArgs>
    _count?: boolean | MemberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["member"]>

  export type MemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberNo?: boolean
    citizenId?: boolean
    firstNameTh?: boolean
    lastNameTh?: boolean
    firstNameEn?: boolean
    lastNameEn?: boolean
    firstNameZh?: boolean
    lastNameZh?: boolean
    email?: boolean
    phone?: boolean
    memberType?: boolean
    status?: boolean
    expireDate?: boolean
    photo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["member"]>

  export type MemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberNo?: boolean
    citizenId?: boolean
    firstNameTh?: boolean
    lastNameTh?: boolean
    firstNameEn?: boolean
    lastNameEn?: boolean
    firstNameZh?: boolean
    lastNameZh?: boolean
    email?: boolean
    phone?: boolean
    memberType?: boolean
    status?: boolean
    expireDate?: boolean
    photo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["member"]>

  export type MemberSelectScalar = {
    id?: boolean
    memberNo?: boolean
    citizenId?: boolean
    firstNameTh?: boolean
    lastNameTh?: boolean
    firstNameEn?: boolean
    lastNameEn?: boolean
    firstNameZh?: boolean
    lastNameZh?: boolean
    email?: boolean
    phone?: boolean
    memberType?: boolean
    status?: boolean
    expireDate?: boolean
    photo?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "memberNo" | "citizenId" | "firstNameTh" | "lastNameTh" | "firstNameEn" | "lastNameEn" | "firstNameZh" | "lastNameZh" | "email" | "phone" | "memberType" | "status" | "expireDate" | "photo" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["member"]>
  export type MemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    qrTokens?: boolean | Member$qrTokensArgs<ExtArgs>
    accessEvents?: boolean | Member$accessEventsArgs<ExtArgs>
    idCardSessions?: boolean | Member$idCardSessionsArgs<ExtArgs>
    _count?: boolean | MemberCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Member"
    objects: {
      qrTokens: Prisma.$QrTokenPayload<ExtArgs>[]
      accessEvents: Prisma.$AccessEventPayload<ExtArgs>[]
      idCardSessions: Prisma.$IdCardSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      memberNo: string
      citizenId: string | null
      firstNameTh: string
      lastNameTh: string
      firstNameEn: string | null
      lastNameEn: string | null
      firstNameZh: string | null
      lastNameZh: string | null
      email: string | null
      phone: string | null
      memberType: $Enums.MemberType
      status: $Enums.MemberStatus
      expireDate: Date | null
      photo: Prisma.Bytes | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["member"]>
    composites: {}
  }

  type MemberGetPayload<S extends boolean | null | undefined | MemberDefaultArgs> = $Result.GetResult<Prisma.$MemberPayload, S>

  type MemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemberCountAggregateInputType | true
    }

  export interface MemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Member'], meta: { name: 'Member' } }
    /**
     * Find zero or one Member that matches the filter.
     * @param {MemberFindUniqueArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemberFindUniqueArgs>(args: SelectSubset<T, MemberFindUniqueArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Member that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemberFindUniqueOrThrowArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemberFindUniqueOrThrowArgs>(args: SelectSubset<T, MemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Member that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindFirstArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemberFindFirstArgs>(args?: SelectSubset<T, MemberFindFirstArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Member that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindFirstOrThrowArgs} args - Arguments to find a Member
     * @example
     * // Get one Member
     * const member = await prisma.member.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemberFindFirstOrThrowArgs>(args?: SelectSubset<T, MemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Members that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Members
     * const members = await prisma.member.findMany()
     * 
     * // Get first 10 Members
     * const members = await prisma.member.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const memberWithIdOnly = await prisma.member.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MemberFindManyArgs>(args?: SelectSubset<T, MemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Member.
     * @param {MemberCreateArgs} args - Arguments to create a Member.
     * @example
     * // Create one Member
     * const Member = await prisma.member.create({
     *   data: {
     *     // ... data to create a Member
     *   }
     * })
     * 
     */
    create<T extends MemberCreateArgs>(args: SelectSubset<T, MemberCreateArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Members.
     * @param {MemberCreateManyArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const member = await prisma.member.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MemberCreateManyArgs>(args?: SelectSubset<T, MemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Members and returns the data saved in the database.
     * @param {MemberCreateManyAndReturnArgs} args - Arguments to create many Members.
     * @example
     * // Create many Members
     * const member = await prisma.member.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Members and only return the `id`
     * const memberWithIdOnly = await prisma.member.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MemberCreateManyAndReturnArgs>(args?: SelectSubset<T, MemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Member.
     * @param {MemberDeleteArgs} args - Arguments to delete one Member.
     * @example
     * // Delete one Member
     * const Member = await prisma.member.delete({
     *   where: {
     *     // ... filter to delete one Member
     *   }
     * })
     * 
     */
    delete<T extends MemberDeleteArgs>(args: SelectSubset<T, MemberDeleteArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Member.
     * @param {MemberUpdateArgs} args - Arguments to update one Member.
     * @example
     * // Update one Member
     * const member = await prisma.member.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MemberUpdateArgs>(args: SelectSubset<T, MemberUpdateArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Members.
     * @param {MemberDeleteManyArgs} args - Arguments to filter Members to delete.
     * @example
     * // Delete a few Members
     * const { count } = await prisma.member.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MemberDeleteManyArgs>(args?: SelectSubset<T, MemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Members
     * const member = await prisma.member.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MemberUpdateManyArgs>(args: SelectSubset<T, MemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Members and returns the data updated in the database.
     * @param {MemberUpdateManyAndReturnArgs} args - Arguments to update many Members.
     * @example
     * // Update many Members
     * const member = await prisma.member.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Members and only return the `id`
     * const memberWithIdOnly = await prisma.member.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MemberUpdateManyAndReturnArgs>(args: SelectSubset<T, MemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Member.
     * @param {MemberUpsertArgs} args - Arguments to update or create a Member.
     * @example
     * // Update or create a Member
     * const member = await prisma.member.upsert({
     *   create: {
     *     // ... data to create a Member
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Member we want to update
     *   }
     * })
     */
    upsert<T extends MemberUpsertArgs>(args: SelectSubset<T, MemberUpsertArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Members.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberCountArgs} args - Arguments to filter Members to count.
     * @example
     * // Count the number of Members
     * const count = await prisma.member.count({
     *   where: {
     *     // ... the filter for the Members we want to count
     *   }
     * })
    **/
    count<T extends MemberCountArgs>(
      args?: Subset<T, MemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Member.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MemberAggregateArgs>(args: Subset<T, MemberAggregateArgs>): Prisma.PrismaPromise<GetMemberAggregateType<T>>

    /**
     * Group by Member.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemberGroupByArgs['orderBy'] }
        : { orderBy?: MemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Member model
   */
  readonly fields: MemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Member.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    qrTokens<T extends Member$qrTokensArgs<ExtArgs> = {}>(args?: Subset<T, Member$qrTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accessEvents<T extends Member$accessEventsArgs<ExtArgs> = {}>(args?: Subset<T, Member$accessEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    idCardSessions<T extends Member$idCardSessionsArgs<ExtArgs> = {}>(args?: Subset<T, Member$idCardSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Member model
   */
  interface MemberFieldRefs {
    readonly id: FieldRef<"Member", 'String'>
    readonly memberNo: FieldRef<"Member", 'String'>
    readonly citizenId: FieldRef<"Member", 'String'>
    readonly firstNameTh: FieldRef<"Member", 'String'>
    readonly lastNameTh: FieldRef<"Member", 'String'>
    readonly firstNameEn: FieldRef<"Member", 'String'>
    readonly lastNameEn: FieldRef<"Member", 'String'>
    readonly firstNameZh: FieldRef<"Member", 'String'>
    readonly lastNameZh: FieldRef<"Member", 'String'>
    readonly email: FieldRef<"Member", 'String'>
    readonly phone: FieldRef<"Member", 'String'>
    readonly memberType: FieldRef<"Member", 'MemberType'>
    readonly status: FieldRef<"Member", 'MemberStatus'>
    readonly expireDate: FieldRef<"Member", 'DateTime'>
    readonly photo: FieldRef<"Member", 'Bytes'>
    readonly metadata: FieldRef<"Member", 'Json'>
    readonly createdAt: FieldRef<"Member", 'DateTime'>
    readonly updatedAt: FieldRef<"Member", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Member findUnique
   */
  export type MemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member findUniqueOrThrow
   */
  export type MemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member findFirst
   */
  export type MemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member findFirstOrThrow
   */
  export type MemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Member to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member findMany
   */
  export type MemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter, which Members to fetch.
     */
    where?: MemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Members to fetch.
     */
    orderBy?: MemberOrderByWithRelationInput | MemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Members.
     */
    cursor?: MemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Members from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Members.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Members.
     */
    distinct?: MemberScalarFieldEnum | MemberScalarFieldEnum[]
  }

  /**
   * Member create
   */
  export type MemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The data needed to create a Member.
     */
    data: XOR<MemberCreateInput, MemberUncheckedCreateInput>
  }

  /**
   * Member createMany
   */
  export type MemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Members.
     */
    data: MemberCreateManyInput | MemberCreateManyInput[]
  }

  /**
   * Member createManyAndReturn
   */
  export type MemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * The data used to create many Members.
     */
    data: MemberCreateManyInput | MemberCreateManyInput[]
  }

  /**
   * Member update
   */
  export type MemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The data needed to update a Member.
     */
    data: XOR<MemberUpdateInput, MemberUncheckedUpdateInput>
    /**
     * Choose, which Member to update.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member updateMany
   */
  export type MemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Members.
     */
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
  }

  /**
   * Member updateManyAndReturn
   */
  export type MemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * The data used to update Members.
     */
    data: XOR<MemberUpdateManyMutationInput, MemberUncheckedUpdateManyInput>
    /**
     * Filter which Members to update
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to update.
     */
    limit?: number
  }

  /**
   * Member upsert
   */
  export type MemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * The filter to search for the Member to update in case it exists.
     */
    where: MemberWhereUniqueInput
    /**
     * In case the Member found by the `where` argument doesn't exist, create a new Member with this data.
     */
    create: XOR<MemberCreateInput, MemberUncheckedCreateInput>
    /**
     * In case the Member was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemberUpdateInput, MemberUncheckedUpdateInput>
  }

  /**
   * Member delete
   */
  export type MemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    /**
     * Filter which Member to delete.
     */
    where: MemberWhereUniqueInput
  }

  /**
   * Member deleteMany
   */
  export type MemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Members to delete
     */
    where?: MemberWhereInput
    /**
     * Limit how many Members to delete.
     */
    limit?: number
  }

  /**
   * Member.qrTokens
   */
  export type Member$qrTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    where?: QrTokenWhereInput
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    cursor?: QrTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * Member.accessEvents
   */
  export type Member$accessEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    where?: AccessEventWhereInput
    orderBy?: AccessEventOrderByWithRelationInput | AccessEventOrderByWithRelationInput[]
    cursor?: AccessEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccessEventScalarFieldEnum | AccessEventScalarFieldEnum[]
  }

  /**
   * Member.idCardSessions
   */
  export type Member$idCardSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    where?: IdCardSessionWhereInput
    orderBy?: IdCardSessionOrderByWithRelationInput | IdCardSessionOrderByWithRelationInput[]
    cursor?: IdCardSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IdCardSessionScalarFieldEnum | IdCardSessionScalarFieldEnum[]
  }

  /**
   * Member without action
   */
  export type MemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
  }


  /**
   * Model QrToken
   */

  export type AggregateQrToken = {
    _count: QrTokenCountAggregateOutputType | null
    _min: QrTokenMinAggregateOutputType | null
    _max: QrTokenMaxAggregateOutputType | null
  }

  export type QrTokenMinAggregateOutputType = {
    id: string | null
    tokenHash: string | null
    memberId: string | null
    purpose: $Enums.QrPurpose | null
    issuedDate: Date | null
    expiresAt: Date | null
    usedAt: Date | null
    revokedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type QrTokenMaxAggregateOutputType = {
    id: string | null
    tokenHash: string | null
    memberId: string | null
    purpose: $Enums.QrPurpose | null
    issuedDate: Date | null
    expiresAt: Date | null
    usedAt: Date | null
    revokedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type QrTokenCountAggregateOutputType = {
    id: number
    tokenHash: number
    memberId: number
    purpose: number
    issuedDate: number
    expiresAt: number
    usedAt: number
    revokedAt: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type QrTokenMinAggregateInputType = {
    id?: true
    tokenHash?: true
    memberId?: true
    purpose?: true
    issuedDate?: true
    expiresAt?: true
    usedAt?: true
    revokedAt?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type QrTokenMaxAggregateInputType = {
    id?: true
    tokenHash?: true
    memberId?: true
    purpose?: true
    issuedDate?: true
    expiresAt?: true
    usedAt?: true
    revokedAt?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type QrTokenCountAggregateInputType = {
    id?: true
    tokenHash?: true
    memberId?: true
    purpose?: true
    issuedDate?: true
    expiresAt?: true
    usedAt?: true
    revokedAt?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type QrTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrToken to aggregate.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QrTokens
    **/
    _count?: true | QrTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QrTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QrTokenMaxAggregateInputType
  }

  export type GetQrTokenAggregateType<T extends QrTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateQrToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQrToken[P]>
      : GetScalarType<T[P], AggregateQrToken[P]>
  }




  export type QrTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QrTokenWhereInput
    orderBy?: QrTokenOrderByWithAggregationInput | QrTokenOrderByWithAggregationInput[]
    by: QrTokenScalarFieldEnum[] | QrTokenScalarFieldEnum
    having?: QrTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QrTokenCountAggregateInputType | true
    _min?: QrTokenMinAggregateInputType
    _max?: QrTokenMaxAggregateInputType
  }

  export type QrTokenGroupByOutputType = {
    id: string
    tokenHash: string
    memberId: string
    purpose: $Enums.QrPurpose
    issuedDate: Date
    expiresAt: Date
    usedAt: Date | null
    revokedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: QrTokenCountAggregateOutputType | null
    _min: QrTokenMinAggregateOutputType | null
    _max: QrTokenMaxAggregateOutputType | null
  }

  type GetQrTokenGroupByPayload<T extends QrTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QrTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QrTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QrTokenGroupByOutputType[P]>
            : GetScalarType<T[P], QrTokenGroupByOutputType[P]>
        }
      >
    >


  export type QrTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenHash?: boolean
    memberId?: boolean
    purpose?: boolean
    issuedDate?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    revokedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
    accessEvent?: boolean | QrToken$accessEventArgs<ExtArgs>
  }, ExtArgs["result"]["qrToken"]>

  export type QrTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenHash?: boolean
    memberId?: boolean
    purpose?: boolean
    issuedDate?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    revokedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["qrToken"]>

  export type QrTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tokenHash?: boolean
    memberId?: boolean
    purpose?: boolean
    issuedDate?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    revokedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["qrToken"]>

  export type QrTokenSelectScalar = {
    id?: boolean
    tokenHash?: boolean
    memberId?: boolean
    purpose?: boolean
    issuedDate?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    revokedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type QrTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tokenHash" | "memberId" | "purpose" | "issuedDate" | "expiresAt" | "usedAt" | "revokedAt" | "ipAddress" | "userAgent" | "createdAt", ExtArgs["result"]["qrToken"]>
  export type QrTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
    accessEvent?: boolean | QrToken$accessEventArgs<ExtArgs>
  }
  export type QrTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }
  export type QrTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | MemberDefaultArgs<ExtArgs>
  }

  export type $QrTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QrToken"
    objects: {
      member: Prisma.$MemberPayload<ExtArgs>
      accessEvent: Prisma.$AccessEventPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tokenHash: string
      memberId: string
      purpose: $Enums.QrPurpose
      issuedDate: Date
      expiresAt: Date
      usedAt: Date | null
      revokedAt: Date | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["qrToken"]>
    composites: {}
  }

  type QrTokenGetPayload<S extends boolean | null | undefined | QrTokenDefaultArgs> = $Result.GetResult<Prisma.$QrTokenPayload, S>

  type QrTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QrTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QrTokenCountAggregateInputType | true
    }

  export interface QrTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QrToken'], meta: { name: 'QrToken' } }
    /**
     * Find zero or one QrToken that matches the filter.
     * @param {QrTokenFindUniqueArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QrTokenFindUniqueArgs>(args: SelectSubset<T, QrTokenFindUniqueArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QrToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QrTokenFindUniqueOrThrowArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QrTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, QrTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QrToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenFindFirstArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QrTokenFindFirstArgs>(args?: SelectSubset<T, QrTokenFindFirstArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QrToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenFindFirstOrThrowArgs} args - Arguments to find a QrToken
     * @example
     * // Get one QrToken
     * const qrToken = await prisma.qrToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QrTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, QrTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QrTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QrTokens
     * const qrTokens = await prisma.qrToken.findMany()
     * 
     * // Get first 10 QrTokens
     * const qrTokens = await prisma.qrToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qrTokenWithIdOnly = await prisma.qrToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QrTokenFindManyArgs>(args?: SelectSubset<T, QrTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QrToken.
     * @param {QrTokenCreateArgs} args - Arguments to create a QrToken.
     * @example
     * // Create one QrToken
     * const QrToken = await prisma.qrToken.create({
     *   data: {
     *     // ... data to create a QrToken
     *   }
     * })
     * 
     */
    create<T extends QrTokenCreateArgs>(args: SelectSubset<T, QrTokenCreateArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QrTokens.
     * @param {QrTokenCreateManyArgs} args - Arguments to create many QrTokens.
     * @example
     * // Create many QrTokens
     * const qrToken = await prisma.qrToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QrTokenCreateManyArgs>(args?: SelectSubset<T, QrTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QrTokens and returns the data saved in the database.
     * @param {QrTokenCreateManyAndReturnArgs} args - Arguments to create many QrTokens.
     * @example
     * // Create many QrTokens
     * const qrToken = await prisma.qrToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QrTokens and only return the `id`
     * const qrTokenWithIdOnly = await prisma.qrToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QrTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, QrTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QrToken.
     * @param {QrTokenDeleteArgs} args - Arguments to delete one QrToken.
     * @example
     * // Delete one QrToken
     * const QrToken = await prisma.qrToken.delete({
     *   where: {
     *     // ... filter to delete one QrToken
     *   }
     * })
     * 
     */
    delete<T extends QrTokenDeleteArgs>(args: SelectSubset<T, QrTokenDeleteArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QrToken.
     * @param {QrTokenUpdateArgs} args - Arguments to update one QrToken.
     * @example
     * // Update one QrToken
     * const qrToken = await prisma.qrToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QrTokenUpdateArgs>(args: SelectSubset<T, QrTokenUpdateArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QrTokens.
     * @param {QrTokenDeleteManyArgs} args - Arguments to filter QrTokens to delete.
     * @example
     * // Delete a few QrTokens
     * const { count } = await prisma.qrToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QrTokenDeleteManyArgs>(args?: SelectSubset<T, QrTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QrTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QrTokens
     * const qrToken = await prisma.qrToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QrTokenUpdateManyArgs>(args: SelectSubset<T, QrTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QrTokens and returns the data updated in the database.
     * @param {QrTokenUpdateManyAndReturnArgs} args - Arguments to update many QrTokens.
     * @example
     * // Update many QrTokens
     * const qrToken = await prisma.qrToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QrTokens and only return the `id`
     * const qrTokenWithIdOnly = await prisma.qrToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QrTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, QrTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QrToken.
     * @param {QrTokenUpsertArgs} args - Arguments to update or create a QrToken.
     * @example
     * // Update or create a QrToken
     * const qrToken = await prisma.qrToken.upsert({
     *   create: {
     *     // ... data to create a QrToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QrToken we want to update
     *   }
     * })
     */
    upsert<T extends QrTokenUpsertArgs>(args: SelectSubset<T, QrTokenUpsertArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QrTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenCountArgs} args - Arguments to filter QrTokens to count.
     * @example
     * // Count the number of QrTokens
     * const count = await prisma.qrToken.count({
     *   where: {
     *     // ... the filter for the QrTokens we want to count
     *   }
     * })
    **/
    count<T extends QrTokenCountArgs>(
      args?: Subset<T, QrTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QrTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QrToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QrTokenAggregateArgs>(args: Subset<T, QrTokenAggregateArgs>): Prisma.PrismaPromise<GetQrTokenAggregateType<T>>

    /**
     * Group by QrToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QrTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QrTokenGroupByArgs['orderBy'] }
        : { orderBy?: QrTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QrTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQrTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QrToken model
   */
  readonly fields: QrTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QrToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QrTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    member<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    accessEvent<T extends QrToken$accessEventArgs<ExtArgs> = {}>(args?: Subset<T, QrToken$accessEventArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QrToken model
   */
  interface QrTokenFieldRefs {
    readonly id: FieldRef<"QrToken", 'String'>
    readonly tokenHash: FieldRef<"QrToken", 'String'>
    readonly memberId: FieldRef<"QrToken", 'String'>
    readonly purpose: FieldRef<"QrToken", 'QrPurpose'>
    readonly issuedDate: FieldRef<"QrToken", 'DateTime'>
    readonly expiresAt: FieldRef<"QrToken", 'DateTime'>
    readonly usedAt: FieldRef<"QrToken", 'DateTime'>
    readonly revokedAt: FieldRef<"QrToken", 'DateTime'>
    readonly ipAddress: FieldRef<"QrToken", 'String'>
    readonly userAgent: FieldRef<"QrToken", 'String'>
    readonly createdAt: FieldRef<"QrToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QrToken findUnique
   */
  export type QrTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken findUniqueOrThrow
   */
  export type QrTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken findFirst
   */
  export type QrTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrTokens.
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrTokens.
     */
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * QrToken findFirstOrThrow
   */
  export type QrTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrToken to fetch.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrTokens.
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrTokens.
     */
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * QrToken findMany
   */
  export type QrTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter, which QrTokens to fetch.
     */
    where?: QrTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrTokens to fetch.
     */
    orderBy?: QrTokenOrderByWithRelationInput | QrTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QrTokens.
     */
    cursor?: QrTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrTokens.
     */
    distinct?: QrTokenScalarFieldEnum | QrTokenScalarFieldEnum[]
  }

  /**
   * QrToken create
   */
  export type QrTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a QrToken.
     */
    data: XOR<QrTokenCreateInput, QrTokenUncheckedCreateInput>
  }

  /**
   * QrToken createMany
   */
  export type QrTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QrTokens.
     */
    data: QrTokenCreateManyInput | QrTokenCreateManyInput[]
  }

  /**
   * QrToken createManyAndReturn
   */
  export type QrTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * The data used to create many QrTokens.
     */
    data: QrTokenCreateManyInput | QrTokenCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QrToken update
   */
  export type QrTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a QrToken.
     */
    data: XOR<QrTokenUpdateInput, QrTokenUncheckedUpdateInput>
    /**
     * Choose, which QrToken to update.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken updateMany
   */
  export type QrTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QrTokens.
     */
    data: XOR<QrTokenUpdateManyMutationInput, QrTokenUncheckedUpdateManyInput>
    /**
     * Filter which QrTokens to update
     */
    where?: QrTokenWhereInput
    /**
     * Limit how many QrTokens to update.
     */
    limit?: number
  }

  /**
   * QrToken updateManyAndReturn
   */
  export type QrTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * The data used to update QrTokens.
     */
    data: XOR<QrTokenUpdateManyMutationInput, QrTokenUncheckedUpdateManyInput>
    /**
     * Filter which QrTokens to update
     */
    where?: QrTokenWhereInput
    /**
     * Limit how many QrTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QrToken upsert
   */
  export type QrTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the QrToken to update in case it exists.
     */
    where: QrTokenWhereUniqueInput
    /**
     * In case the QrToken found by the `where` argument doesn't exist, create a new QrToken with this data.
     */
    create: XOR<QrTokenCreateInput, QrTokenUncheckedCreateInput>
    /**
     * In case the QrToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QrTokenUpdateInput, QrTokenUncheckedUpdateInput>
  }

  /**
   * QrToken delete
   */
  export type QrTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    /**
     * Filter which QrToken to delete.
     */
    where: QrTokenWhereUniqueInput
  }

  /**
   * QrToken deleteMany
   */
  export type QrTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrTokens to delete
     */
    where?: QrTokenWhereInput
    /**
     * Limit how many QrTokens to delete.
     */
    limit?: number
  }

  /**
   * QrToken.accessEvent
   */
  export type QrToken$accessEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    where?: AccessEventWhereInput
  }

  /**
   * QrToken without action
   */
  export type QrTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
  }


  /**
   * Model QrPolicy
   */

  export type AggregateQrPolicy = {
    _count: QrPolicyCountAggregateOutputType | null
    _avg: QrPolicyAvgAggregateOutputType | null
    _sum: QrPolicySumAggregateOutputType | null
    _min: QrPolicyMinAggregateOutputType | null
    _max: QrPolicyMaxAggregateOutputType | null
  }

  export type QrPolicyAvgAggregateOutputType = {
    ttlSeconds: number | null
    maxUsesPerDay: number | null
  }

  export type QrPolicySumAggregateOutputType = {
    ttlSeconds: number | null
    maxUsesPerDay: number | null
  }

  export type QrPolicyMinAggregateOutputType = {
    id: string | null
    name: string | null
    ttlSeconds: number | null
    oneTimeUse: boolean | null
    maxUsesPerDay: number | null
    dailyStartTime: string | null
    dailyEndTime: string | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QrPolicyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ttlSeconds: number | null
    oneTimeUse: boolean | null
    maxUsesPerDay: number | null
    dailyStartTime: string | null
    dailyEndTime: string | null
    isDefault: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type QrPolicyCountAggregateOutputType = {
    id: number
    name: number
    ttlSeconds: number
    oneTimeUse: number
    maxUsesPerDay: number
    dailyStartTime: number
    dailyEndTime: number
    isDefault: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type QrPolicyAvgAggregateInputType = {
    ttlSeconds?: true
    maxUsesPerDay?: true
  }

  export type QrPolicySumAggregateInputType = {
    ttlSeconds?: true
    maxUsesPerDay?: true
  }

  export type QrPolicyMinAggregateInputType = {
    id?: true
    name?: true
    ttlSeconds?: true
    oneTimeUse?: true
    maxUsesPerDay?: true
    dailyStartTime?: true
    dailyEndTime?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QrPolicyMaxAggregateInputType = {
    id?: true
    name?: true
    ttlSeconds?: true
    oneTimeUse?: true
    maxUsesPerDay?: true
    dailyStartTime?: true
    dailyEndTime?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
  }

  export type QrPolicyCountAggregateInputType = {
    id?: true
    name?: true
    ttlSeconds?: true
    oneTimeUse?: true
    maxUsesPerDay?: true
    dailyStartTime?: true
    dailyEndTime?: true
    isDefault?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type QrPolicyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrPolicy to aggregate.
     */
    where?: QrPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrPolicies to fetch.
     */
    orderBy?: QrPolicyOrderByWithRelationInput | QrPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QrPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QrPolicies
    **/
    _count?: true | QrPolicyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QrPolicyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QrPolicySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QrPolicyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QrPolicyMaxAggregateInputType
  }

  export type GetQrPolicyAggregateType<T extends QrPolicyAggregateArgs> = {
        [P in keyof T & keyof AggregateQrPolicy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQrPolicy[P]>
      : GetScalarType<T[P], AggregateQrPolicy[P]>
  }




  export type QrPolicyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QrPolicyWhereInput
    orderBy?: QrPolicyOrderByWithAggregationInput | QrPolicyOrderByWithAggregationInput[]
    by: QrPolicyScalarFieldEnum[] | QrPolicyScalarFieldEnum
    having?: QrPolicyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QrPolicyCountAggregateInputType | true
    _avg?: QrPolicyAvgAggregateInputType
    _sum?: QrPolicySumAggregateInputType
    _min?: QrPolicyMinAggregateInputType
    _max?: QrPolicyMaxAggregateInputType
  }

  export type QrPolicyGroupByOutputType = {
    id: string
    name: string
    ttlSeconds: number
    oneTimeUse: boolean
    maxUsesPerDay: number
    dailyStartTime: string | null
    dailyEndTime: string | null
    isDefault: boolean
    createdAt: Date
    updatedAt: Date
    _count: QrPolicyCountAggregateOutputType | null
    _avg: QrPolicyAvgAggregateOutputType | null
    _sum: QrPolicySumAggregateOutputType | null
    _min: QrPolicyMinAggregateOutputType | null
    _max: QrPolicyMaxAggregateOutputType | null
  }

  type GetQrPolicyGroupByPayload<T extends QrPolicyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QrPolicyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QrPolicyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QrPolicyGroupByOutputType[P]>
            : GetScalarType<T[P], QrPolicyGroupByOutputType[P]>
        }
      >
    >


  export type QrPolicySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ttlSeconds?: boolean
    oneTimeUse?: boolean
    maxUsesPerDay?: boolean
    dailyStartTime?: boolean
    dailyEndTime?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["qrPolicy"]>

  export type QrPolicySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ttlSeconds?: boolean
    oneTimeUse?: boolean
    maxUsesPerDay?: boolean
    dailyStartTime?: boolean
    dailyEndTime?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["qrPolicy"]>

  export type QrPolicySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ttlSeconds?: boolean
    oneTimeUse?: boolean
    maxUsesPerDay?: boolean
    dailyStartTime?: boolean
    dailyEndTime?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["qrPolicy"]>

  export type QrPolicySelectScalar = {
    id?: boolean
    name?: boolean
    ttlSeconds?: boolean
    oneTimeUse?: boolean
    maxUsesPerDay?: boolean
    dailyStartTime?: boolean
    dailyEndTime?: boolean
    isDefault?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type QrPolicyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "ttlSeconds" | "oneTimeUse" | "maxUsesPerDay" | "dailyStartTime" | "dailyEndTime" | "isDefault" | "createdAt" | "updatedAt", ExtArgs["result"]["qrPolicy"]>

  export type $QrPolicyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QrPolicy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ttlSeconds: number
      oneTimeUse: boolean
      maxUsesPerDay: number
      dailyStartTime: string | null
      dailyEndTime: string | null
      isDefault: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["qrPolicy"]>
    composites: {}
  }

  type QrPolicyGetPayload<S extends boolean | null | undefined | QrPolicyDefaultArgs> = $Result.GetResult<Prisma.$QrPolicyPayload, S>

  type QrPolicyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QrPolicyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QrPolicyCountAggregateInputType | true
    }

  export interface QrPolicyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QrPolicy'], meta: { name: 'QrPolicy' } }
    /**
     * Find zero or one QrPolicy that matches the filter.
     * @param {QrPolicyFindUniqueArgs} args - Arguments to find a QrPolicy
     * @example
     * // Get one QrPolicy
     * const qrPolicy = await prisma.qrPolicy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QrPolicyFindUniqueArgs>(args: SelectSubset<T, QrPolicyFindUniqueArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QrPolicy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QrPolicyFindUniqueOrThrowArgs} args - Arguments to find a QrPolicy
     * @example
     * // Get one QrPolicy
     * const qrPolicy = await prisma.qrPolicy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QrPolicyFindUniqueOrThrowArgs>(args: SelectSubset<T, QrPolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QrPolicy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyFindFirstArgs} args - Arguments to find a QrPolicy
     * @example
     * // Get one QrPolicy
     * const qrPolicy = await prisma.qrPolicy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QrPolicyFindFirstArgs>(args?: SelectSubset<T, QrPolicyFindFirstArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QrPolicy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyFindFirstOrThrowArgs} args - Arguments to find a QrPolicy
     * @example
     * // Get one QrPolicy
     * const qrPolicy = await prisma.qrPolicy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QrPolicyFindFirstOrThrowArgs>(args?: SelectSubset<T, QrPolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QrPolicies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QrPolicies
     * const qrPolicies = await prisma.qrPolicy.findMany()
     * 
     * // Get first 10 QrPolicies
     * const qrPolicies = await prisma.qrPolicy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qrPolicyWithIdOnly = await prisma.qrPolicy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QrPolicyFindManyArgs>(args?: SelectSubset<T, QrPolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QrPolicy.
     * @param {QrPolicyCreateArgs} args - Arguments to create a QrPolicy.
     * @example
     * // Create one QrPolicy
     * const QrPolicy = await prisma.qrPolicy.create({
     *   data: {
     *     // ... data to create a QrPolicy
     *   }
     * })
     * 
     */
    create<T extends QrPolicyCreateArgs>(args: SelectSubset<T, QrPolicyCreateArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QrPolicies.
     * @param {QrPolicyCreateManyArgs} args - Arguments to create many QrPolicies.
     * @example
     * // Create many QrPolicies
     * const qrPolicy = await prisma.qrPolicy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QrPolicyCreateManyArgs>(args?: SelectSubset<T, QrPolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QrPolicies and returns the data saved in the database.
     * @param {QrPolicyCreateManyAndReturnArgs} args - Arguments to create many QrPolicies.
     * @example
     * // Create many QrPolicies
     * const qrPolicy = await prisma.qrPolicy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QrPolicies and only return the `id`
     * const qrPolicyWithIdOnly = await prisma.qrPolicy.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QrPolicyCreateManyAndReturnArgs>(args?: SelectSubset<T, QrPolicyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QrPolicy.
     * @param {QrPolicyDeleteArgs} args - Arguments to delete one QrPolicy.
     * @example
     * // Delete one QrPolicy
     * const QrPolicy = await prisma.qrPolicy.delete({
     *   where: {
     *     // ... filter to delete one QrPolicy
     *   }
     * })
     * 
     */
    delete<T extends QrPolicyDeleteArgs>(args: SelectSubset<T, QrPolicyDeleteArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QrPolicy.
     * @param {QrPolicyUpdateArgs} args - Arguments to update one QrPolicy.
     * @example
     * // Update one QrPolicy
     * const qrPolicy = await prisma.qrPolicy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QrPolicyUpdateArgs>(args: SelectSubset<T, QrPolicyUpdateArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QrPolicies.
     * @param {QrPolicyDeleteManyArgs} args - Arguments to filter QrPolicies to delete.
     * @example
     * // Delete a few QrPolicies
     * const { count } = await prisma.qrPolicy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QrPolicyDeleteManyArgs>(args?: SelectSubset<T, QrPolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QrPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QrPolicies
     * const qrPolicy = await prisma.qrPolicy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QrPolicyUpdateManyArgs>(args: SelectSubset<T, QrPolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QrPolicies and returns the data updated in the database.
     * @param {QrPolicyUpdateManyAndReturnArgs} args - Arguments to update many QrPolicies.
     * @example
     * // Update many QrPolicies
     * const qrPolicy = await prisma.qrPolicy.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QrPolicies and only return the `id`
     * const qrPolicyWithIdOnly = await prisma.qrPolicy.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QrPolicyUpdateManyAndReturnArgs>(args: SelectSubset<T, QrPolicyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QrPolicy.
     * @param {QrPolicyUpsertArgs} args - Arguments to update or create a QrPolicy.
     * @example
     * // Update or create a QrPolicy
     * const qrPolicy = await prisma.qrPolicy.upsert({
     *   create: {
     *     // ... data to create a QrPolicy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QrPolicy we want to update
     *   }
     * })
     */
    upsert<T extends QrPolicyUpsertArgs>(args: SelectSubset<T, QrPolicyUpsertArgs<ExtArgs>>): Prisma__QrPolicyClient<$Result.GetResult<Prisma.$QrPolicyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QrPolicies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyCountArgs} args - Arguments to filter QrPolicies to count.
     * @example
     * // Count the number of QrPolicies
     * const count = await prisma.qrPolicy.count({
     *   where: {
     *     // ... the filter for the QrPolicies we want to count
     *   }
     * })
    **/
    count<T extends QrPolicyCountArgs>(
      args?: Subset<T, QrPolicyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QrPolicyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QrPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QrPolicyAggregateArgs>(args: Subset<T, QrPolicyAggregateArgs>): Prisma.PrismaPromise<GetQrPolicyAggregateType<T>>

    /**
     * Group by QrPolicy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QrPolicyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QrPolicyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QrPolicyGroupByArgs['orderBy'] }
        : { orderBy?: QrPolicyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QrPolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQrPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QrPolicy model
   */
  readonly fields: QrPolicyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QrPolicy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QrPolicyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QrPolicy model
   */
  interface QrPolicyFieldRefs {
    readonly id: FieldRef<"QrPolicy", 'String'>
    readonly name: FieldRef<"QrPolicy", 'String'>
    readonly ttlSeconds: FieldRef<"QrPolicy", 'Int'>
    readonly oneTimeUse: FieldRef<"QrPolicy", 'Boolean'>
    readonly maxUsesPerDay: FieldRef<"QrPolicy", 'Int'>
    readonly dailyStartTime: FieldRef<"QrPolicy", 'String'>
    readonly dailyEndTime: FieldRef<"QrPolicy", 'String'>
    readonly isDefault: FieldRef<"QrPolicy", 'Boolean'>
    readonly createdAt: FieldRef<"QrPolicy", 'DateTime'>
    readonly updatedAt: FieldRef<"QrPolicy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * QrPolicy findUnique
   */
  export type QrPolicyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * Filter, which QrPolicy to fetch.
     */
    where: QrPolicyWhereUniqueInput
  }

  /**
   * QrPolicy findUniqueOrThrow
   */
  export type QrPolicyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * Filter, which QrPolicy to fetch.
     */
    where: QrPolicyWhereUniqueInput
  }

  /**
   * QrPolicy findFirst
   */
  export type QrPolicyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * Filter, which QrPolicy to fetch.
     */
    where?: QrPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrPolicies to fetch.
     */
    orderBy?: QrPolicyOrderByWithRelationInput | QrPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrPolicies.
     */
    cursor?: QrPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrPolicies.
     */
    distinct?: QrPolicyScalarFieldEnum | QrPolicyScalarFieldEnum[]
  }

  /**
   * QrPolicy findFirstOrThrow
   */
  export type QrPolicyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * Filter, which QrPolicy to fetch.
     */
    where?: QrPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrPolicies to fetch.
     */
    orderBy?: QrPolicyOrderByWithRelationInput | QrPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QrPolicies.
     */
    cursor?: QrPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrPolicies.
     */
    distinct?: QrPolicyScalarFieldEnum | QrPolicyScalarFieldEnum[]
  }

  /**
   * QrPolicy findMany
   */
  export type QrPolicyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * Filter, which QrPolicies to fetch.
     */
    where?: QrPolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QrPolicies to fetch.
     */
    orderBy?: QrPolicyOrderByWithRelationInput | QrPolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QrPolicies.
     */
    cursor?: QrPolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QrPolicies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QrPolicies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QrPolicies.
     */
    distinct?: QrPolicyScalarFieldEnum | QrPolicyScalarFieldEnum[]
  }

  /**
   * QrPolicy create
   */
  export type QrPolicyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * The data needed to create a QrPolicy.
     */
    data: XOR<QrPolicyCreateInput, QrPolicyUncheckedCreateInput>
  }

  /**
   * QrPolicy createMany
   */
  export type QrPolicyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QrPolicies.
     */
    data: QrPolicyCreateManyInput | QrPolicyCreateManyInput[]
  }

  /**
   * QrPolicy createManyAndReturn
   */
  export type QrPolicyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * The data used to create many QrPolicies.
     */
    data: QrPolicyCreateManyInput | QrPolicyCreateManyInput[]
  }

  /**
   * QrPolicy update
   */
  export type QrPolicyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * The data needed to update a QrPolicy.
     */
    data: XOR<QrPolicyUpdateInput, QrPolicyUncheckedUpdateInput>
    /**
     * Choose, which QrPolicy to update.
     */
    where: QrPolicyWhereUniqueInput
  }

  /**
   * QrPolicy updateMany
   */
  export type QrPolicyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QrPolicies.
     */
    data: XOR<QrPolicyUpdateManyMutationInput, QrPolicyUncheckedUpdateManyInput>
    /**
     * Filter which QrPolicies to update
     */
    where?: QrPolicyWhereInput
    /**
     * Limit how many QrPolicies to update.
     */
    limit?: number
  }

  /**
   * QrPolicy updateManyAndReturn
   */
  export type QrPolicyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * The data used to update QrPolicies.
     */
    data: XOR<QrPolicyUpdateManyMutationInput, QrPolicyUncheckedUpdateManyInput>
    /**
     * Filter which QrPolicies to update
     */
    where?: QrPolicyWhereInput
    /**
     * Limit how many QrPolicies to update.
     */
    limit?: number
  }

  /**
   * QrPolicy upsert
   */
  export type QrPolicyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * The filter to search for the QrPolicy to update in case it exists.
     */
    where: QrPolicyWhereUniqueInput
    /**
     * In case the QrPolicy found by the `where` argument doesn't exist, create a new QrPolicy with this data.
     */
    create: XOR<QrPolicyCreateInput, QrPolicyUncheckedCreateInput>
    /**
     * In case the QrPolicy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QrPolicyUpdateInput, QrPolicyUncheckedUpdateInput>
  }

  /**
   * QrPolicy delete
   */
  export type QrPolicyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
    /**
     * Filter which QrPolicy to delete.
     */
    where: QrPolicyWhereUniqueInput
  }

  /**
   * QrPolicy deleteMany
   */
  export type QrPolicyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QrPolicies to delete
     */
    where?: QrPolicyWhereInput
    /**
     * Limit how many QrPolicies to delete.
     */
    limit?: number
  }

  /**
   * QrPolicy without action
   */
  export type QrPolicyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrPolicy
     */
    select?: QrPolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrPolicy
     */
    omit?: QrPolicyOmit<ExtArgs> | null
  }


  /**
   * Model AccessEvent
   */

  export type AggregateAccessEvent = {
    _count: AccessEventCountAggregateOutputType | null
    _min: AccessEventMinAggregateOutputType | null
    _max: AccessEventMaxAggregateOutputType | null
  }

  export type AccessEventMinAggregateOutputType = {
    id: string | null
    gateId: string | null
    memberId: string | null
    qrTokenId: string | null
    direction: $Enums.GateDirection | null
    source: $Enums.AccessSource | null
    decision: $Enums.AccessDecision | null
    reasonCode: string | null
    ipAddress: string | null
    userAgent: string | null
    scannedAt: Date | null
    createdAt: Date | null
  }

  export type AccessEventMaxAggregateOutputType = {
    id: string | null
    gateId: string | null
    memberId: string | null
    qrTokenId: string | null
    direction: $Enums.GateDirection | null
    source: $Enums.AccessSource | null
    decision: $Enums.AccessDecision | null
    reasonCode: string | null
    ipAddress: string | null
    userAgent: string | null
    scannedAt: Date | null
    createdAt: Date | null
  }

  export type AccessEventCountAggregateOutputType = {
    id: number
    gateId: number
    memberId: number
    qrTokenId: number
    direction: number
    source: number
    decision: number
    reasonCode: number
    ipAddress: number
    userAgent: number
    metadata: number
    scannedAt: number
    createdAt: number
    _all: number
  }


  export type AccessEventMinAggregateInputType = {
    id?: true
    gateId?: true
    memberId?: true
    qrTokenId?: true
    direction?: true
    source?: true
    decision?: true
    reasonCode?: true
    ipAddress?: true
    userAgent?: true
    scannedAt?: true
    createdAt?: true
  }

  export type AccessEventMaxAggregateInputType = {
    id?: true
    gateId?: true
    memberId?: true
    qrTokenId?: true
    direction?: true
    source?: true
    decision?: true
    reasonCode?: true
    ipAddress?: true
    userAgent?: true
    scannedAt?: true
    createdAt?: true
  }

  export type AccessEventCountAggregateInputType = {
    id?: true
    gateId?: true
    memberId?: true
    qrTokenId?: true
    direction?: true
    source?: true
    decision?: true
    reasonCode?: true
    ipAddress?: true
    userAgent?: true
    metadata?: true
    scannedAt?: true
    createdAt?: true
    _all?: true
  }

  export type AccessEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessEvent to aggregate.
     */
    where?: AccessEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessEvents to fetch.
     */
    orderBy?: AccessEventOrderByWithRelationInput | AccessEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccessEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccessEvents
    **/
    _count?: true | AccessEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccessEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccessEventMaxAggregateInputType
  }

  export type GetAccessEventAggregateType<T extends AccessEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAccessEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccessEvent[P]>
      : GetScalarType<T[P], AggregateAccessEvent[P]>
  }




  export type AccessEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccessEventWhereInput
    orderBy?: AccessEventOrderByWithAggregationInput | AccessEventOrderByWithAggregationInput[]
    by: AccessEventScalarFieldEnum[] | AccessEventScalarFieldEnum
    having?: AccessEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccessEventCountAggregateInputType | true
    _min?: AccessEventMinAggregateInputType
    _max?: AccessEventMaxAggregateInputType
  }

  export type AccessEventGroupByOutputType = {
    id: string
    gateId: string
    memberId: string
    qrTokenId: string | null
    direction: $Enums.GateDirection
    source: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode: string | null
    ipAddress: string | null
    userAgent: string | null
    metadata: JsonValue | null
    scannedAt: Date
    createdAt: Date
    _count: AccessEventCountAggregateOutputType | null
    _min: AccessEventMinAggregateOutputType | null
    _max: AccessEventMaxAggregateOutputType | null
  }

  type GetAccessEventGroupByPayload<T extends AccessEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccessEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccessEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccessEventGroupByOutputType[P]>
            : GetScalarType<T[P], AccessEventGroupByOutputType[P]>
        }
      >
    >


  export type AccessEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gateId?: boolean
    memberId?: boolean
    qrTokenId?: boolean
    direction?: boolean
    source?: boolean
    decision?: boolean
    reasonCode?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    scannedAt?: boolean
    createdAt?: boolean
    gate?: boolean | GateDefaultArgs<ExtArgs>
    member?: boolean | MemberDefaultArgs<ExtArgs>
    qrToken?: boolean | AccessEvent$qrTokenArgs<ExtArgs>
  }, ExtArgs["result"]["accessEvent"]>

  export type AccessEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gateId?: boolean
    memberId?: boolean
    qrTokenId?: boolean
    direction?: boolean
    source?: boolean
    decision?: boolean
    reasonCode?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    scannedAt?: boolean
    createdAt?: boolean
    gate?: boolean | GateDefaultArgs<ExtArgs>
    member?: boolean | MemberDefaultArgs<ExtArgs>
    qrToken?: boolean | AccessEvent$qrTokenArgs<ExtArgs>
  }, ExtArgs["result"]["accessEvent"]>

  export type AccessEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gateId?: boolean
    memberId?: boolean
    qrTokenId?: boolean
    direction?: boolean
    source?: boolean
    decision?: boolean
    reasonCode?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    scannedAt?: boolean
    createdAt?: boolean
    gate?: boolean | GateDefaultArgs<ExtArgs>
    member?: boolean | MemberDefaultArgs<ExtArgs>
    qrToken?: boolean | AccessEvent$qrTokenArgs<ExtArgs>
  }, ExtArgs["result"]["accessEvent"]>

  export type AccessEventSelectScalar = {
    id?: boolean
    gateId?: boolean
    memberId?: boolean
    qrTokenId?: boolean
    direction?: boolean
    source?: boolean
    decision?: boolean
    reasonCode?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    metadata?: boolean
    scannedAt?: boolean
    createdAt?: boolean
  }

  export type AccessEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gateId" | "memberId" | "qrTokenId" | "direction" | "source" | "decision" | "reasonCode" | "ipAddress" | "userAgent" | "metadata" | "scannedAt" | "createdAt", ExtArgs["result"]["accessEvent"]>
  export type AccessEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gate?: boolean | GateDefaultArgs<ExtArgs>
    member?: boolean | MemberDefaultArgs<ExtArgs>
    qrToken?: boolean | AccessEvent$qrTokenArgs<ExtArgs>
  }
  export type AccessEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gate?: boolean | GateDefaultArgs<ExtArgs>
    member?: boolean | MemberDefaultArgs<ExtArgs>
    qrToken?: boolean | AccessEvent$qrTokenArgs<ExtArgs>
  }
  export type AccessEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gate?: boolean | GateDefaultArgs<ExtArgs>
    member?: boolean | MemberDefaultArgs<ExtArgs>
    qrToken?: boolean | AccessEvent$qrTokenArgs<ExtArgs>
  }

  export type $AccessEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccessEvent"
    objects: {
      gate: Prisma.$GatePayload<ExtArgs>
      member: Prisma.$MemberPayload<ExtArgs>
      qrToken: Prisma.$QrTokenPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gateId: string
      memberId: string
      qrTokenId: string | null
      direction: $Enums.GateDirection
      source: $Enums.AccessSource
      decision: $Enums.AccessDecision
      reasonCode: string | null
      ipAddress: string | null
      userAgent: string | null
      metadata: Prisma.JsonValue | null
      scannedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["accessEvent"]>
    composites: {}
  }

  type AccessEventGetPayload<S extends boolean | null | undefined | AccessEventDefaultArgs> = $Result.GetResult<Prisma.$AccessEventPayload, S>

  type AccessEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccessEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccessEventCountAggregateInputType | true
    }

  export interface AccessEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccessEvent'], meta: { name: 'AccessEvent' } }
    /**
     * Find zero or one AccessEvent that matches the filter.
     * @param {AccessEventFindUniqueArgs} args - Arguments to find a AccessEvent
     * @example
     * // Get one AccessEvent
     * const accessEvent = await prisma.accessEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccessEventFindUniqueArgs>(args: SelectSubset<T, AccessEventFindUniqueArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccessEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccessEventFindUniqueOrThrowArgs} args - Arguments to find a AccessEvent
     * @example
     * // Get one AccessEvent
     * const accessEvent = await prisma.accessEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccessEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AccessEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventFindFirstArgs} args - Arguments to find a AccessEvent
     * @example
     * // Get one AccessEvent
     * const accessEvent = await prisma.accessEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccessEventFindFirstArgs>(args?: SelectSubset<T, AccessEventFindFirstArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccessEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventFindFirstOrThrowArgs} args - Arguments to find a AccessEvent
     * @example
     * // Get one AccessEvent
     * const accessEvent = await prisma.accessEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccessEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AccessEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccessEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccessEvents
     * const accessEvents = await prisma.accessEvent.findMany()
     * 
     * // Get first 10 AccessEvents
     * const accessEvents = await prisma.accessEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accessEventWithIdOnly = await prisma.accessEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccessEventFindManyArgs>(args?: SelectSubset<T, AccessEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccessEvent.
     * @param {AccessEventCreateArgs} args - Arguments to create a AccessEvent.
     * @example
     * // Create one AccessEvent
     * const AccessEvent = await prisma.accessEvent.create({
     *   data: {
     *     // ... data to create a AccessEvent
     *   }
     * })
     * 
     */
    create<T extends AccessEventCreateArgs>(args: SelectSubset<T, AccessEventCreateArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccessEvents.
     * @param {AccessEventCreateManyArgs} args - Arguments to create many AccessEvents.
     * @example
     * // Create many AccessEvents
     * const accessEvent = await prisma.accessEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccessEventCreateManyArgs>(args?: SelectSubset<T, AccessEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccessEvents and returns the data saved in the database.
     * @param {AccessEventCreateManyAndReturnArgs} args - Arguments to create many AccessEvents.
     * @example
     * // Create many AccessEvents
     * const accessEvent = await prisma.accessEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccessEvents and only return the `id`
     * const accessEventWithIdOnly = await prisma.accessEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccessEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AccessEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AccessEvent.
     * @param {AccessEventDeleteArgs} args - Arguments to delete one AccessEvent.
     * @example
     * // Delete one AccessEvent
     * const AccessEvent = await prisma.accessEvent.delete({
     *   where: {
     *     // ... filter to delete one AccessEvent
     *   }
     * })
     * 
     */
    delete<T extends AccessEventDeleteArgs>(args: SelectSubset<T, AccessEventDeleteArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccessEvent.
     * @param {AccessEventUpdateArgs} args - Arguments to update one AccessEvent.
     * @example
     * // Update one AccessEvent
     * const accessEvent = await prisma.accessEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccessEventUpdateArgs>(args: SelectSubset<T, AccessEventUpdateArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccessEvents.
     * @param {AccessEventDeleteManyArgs} args - Arguments to filter AccessEvents to delete.
     * @example
     * // Delete a few AccessEvents
     * const { count } = await prisma.accessEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccessEventDeleteManyArgs>(args?: SelectSubset<T, AccessEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccessEvents
     * const accessEvent = await prisma.accessEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccessEventUpdateManyArgs>(args: SelectSubset<T, AccessEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccessEvents and returns the data updated in the database.
     * @param {AccessEventUpdateManyAndReturnArgs} args - Arguments to update many AccessEvents.
     * @example
     * // Update many AccessEvents
     * const accessEvent = await prisma.accessEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AccessEvents and only return the `id`
     * const accessEventWithIdOnly = await prisma.accessEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccessEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AccessEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AccessEvent.
     * @param {AccessEventUpsertArgs} args - Arguments to update or create a AccessEvent.
     * @example
     * // Update or create a AccessEvent
     * const accessEvent = await prisma.accessEvent.upsert({
     *   create: {
     *     // ... data to create a AccessEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccessEvent we want to update
     *   }
     * })
     */
    upsert<T extends AccessEventUpsertArgs>(args: SelectSubset<T, AccessEventUpsertArgs<ExtArgs>>): Prisma__AccessEventClient<$Result.GetResult<Prisma.$AccessEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccessEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventCountArgs} args - Arguments to filter AccessEvents to count.
     * @example
     * // Count the number of AccessEvents
     * const count = await prisma.accessEvent.count({
     *   where: {
     *     // ... the filter for the AccessEvents we want to count
     *   }
     * })
    **/
    count<T extends AccessEventCountArgs>(
      args?: Subset<T, AccessEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccessEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccessEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccessEventAggregateArgs>(args: Subset<T, AccessEventAggregateArgs>): Prisma.PrismaPromise<GetAccessEventAggregateType<T>>

    /**
     * Group by AccessEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccessEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccessEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccessEventGroupByArgs['orderBy'] }
        : { orderBy?: AccessEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccessEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccessEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccessEvent model
   */
  readonly fields: AccessEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccessEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccessEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gate<T extends GateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GateDefaultArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    member<T extends MemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MemberDefaultArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    qrToken<T extends AccessEvent$qrTokenArgs<ExtArgs> = {}>(args?: Subset<T, AccessEvent$qrTokenArgs<ExtArgs>>): Prisma__QrTokenClient<$Result.GetResult<Prisma.$QrTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccessEvent model
   */
  interface AccessEventFieldRefs {
    readonly id: FieldRef<"AccessEvent", 'String'>
    readonly gateId: FieldRef<"AccessEvent", 'String'>
    readonly memberId: FieldRef<"AccessEvent", 'String'>
    readonly qrTokenId: FieldRef<"AccessEvent", 'String'>
    readonly direction: FieldRef<"AccessEvent", 'GateDirection'>
    readonly source: FieldRef<"AccessEvent", 'AccessSource'>
    readonly decision: FieldRef<"AccessEvent", 'AccessDecision'>
    readonly reasonCode: FieldRef<"AccessEvent", 'String'>
    readonly ipAddress: FieldRef<"AccessEvent", 'String'>
    readonly userAgent: FieldRef<"AccessEvent", 'String'>
    readonly metadata: FieldRef<"AccessEvent", 'Json'>
    readonly scannedAt: FieldRef<"AccessEvent", 'DateTime'>
    readonly createdAt: FieldRef<"AccessEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AccessEvent findUnique
   */
  export type AccessEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * Filter, which AccessEvent to fetch.
     */
    where: AccessEventWhereUniqueInput
  }

  /**
   * AccessEvent findUniqueOrThrow
   */
  export type AccessEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * Filter, which AccessEvent to fetch.
     */
    where: AccessEventWhereUniqueInput
  }

  /**
   * AccessEvent findFirst
   */
  export type AccessEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * Filter, which AccessEvent to fetch.
     */
    where?: AccessEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessEvents to fetch.
     */
    orderBy?: AccessEventOrderByWithRelationInput | AccessEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessEvents.
     */
    cursor?: AccessEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessEvents.
     */
    distinct?: AccessEventScalarFieldEnum | AccessEventScalarFieldEnum[]
  }

  /**
   * AccessEvent findFirstOrThrow
   */
  export type AccessEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * Filter, which AccessEvent to fetch.
     */
    where?: AccessEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessEvents to fetch.
     */
    orderBy?: AccessEventOrderByWithRelationInput | AccessEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccessEvents.
     */
    cursor?: AccessEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessEvents.
     */
    distinct?: AccessEventScalarFieldEnum | AccessEventScalarFieldEnum[]
  }

  /**
   * AccessEvent findMany
   */
  export type AccessEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * Filter, which AccessEvents to fetch.
     */
    where?: AccessEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccessEvents to fetch.
     */
    orderBy?: AccessEventOrderByWithRelationInput | AccessEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccessEvents.
     */
    cursor?: AccessEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccessEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccessEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccessEvents.
     */
    distinct?: AccessEventScalarFieldEnum | AccessEventScalarFieldEnum[]
  }

  /**
   * AccessEvent create
   */
  export type AccessEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AccessEvent.
     */
    data: XOR<AccessEventCreateInput, AccessEventUncheckedCreateInput>
  }

  /**
   * AccessEvent createMany
   */
  export type AccessEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccessEvents.
     */
    data: AccessEventCreateManyInput | AccessEventCreateManyInput[]
  }

  /**
   * AccessEvent createManyAndReturn
   */
  export type AccessEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * The data used to create many AccessEvents.
     */
    data: AccessEventCreateManyInput | AccessEventCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccessEvent update
   */
  export type AccessEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AccessEvent.
     */
    data: XOR<AccessEventUpdateInput, AccessEventUncheckedUpdateInput>
    /**
     * Choose, which AccessEvent to update.
     */
    where: AccessEventWhereUniqueInput
  }

  /**
   * AccessEvent updateMany
   */
  export type AccessEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccessEvents.
     */
    data: XOR<AccessEventUpdateManyMutationInput, AccessEventUncheckedUpdateManyInput>
    /**
     * Filter which AccessEvents to update
     */
    where?: AccessEventWhereInput
    /**
     * Limit how many AccessEvents to update.
     */
    limit?: number
  }

  /**
   * AccessEvent updateManyAndReturn
   */
  export type AccessEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * The data used to update AccessEvents.
     */
    data: XOR<AccessEventUpdateManyMutationInput, AccessEventUncheckedUpdateManyInput>
    /**
     * Filter which AccessEvents to update
     */
    where?: AccessEventWhereInput
    /**
     * Limit how many AccessEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccessEvent upsert
   */
  export type AccessEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AccessEvent to update in case it exists.
     */
    where: AccessEventWhereUniqueInput
    /**
     * In case the AccessEvent found by the `where` argument doesn't exist, create a new AccessEvent with this data.
     */
    create: XOR<AccessEventCreateInput, AccessEventUncheckedCreateInput>
    /**
     * In case the AccessEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccessEventUpdateInput, AccessEventUncheckedUpdateInput>
  }

  /**
   * AccessEvent delete
   */
  export type AccessEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
    /**
     * Filter which AccessEvent to delete.
     */
    where: AccessEventWhereUniqueInput
  }

  /**
   * AccessEvent deleteMany
   */
  export type AccessEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccessEvents to delete
     */
    where?: AccessEventWhereInput
    /**
     * Limit how many AccessEvents to delete.
     */
    limit?: number
  }

  /**
   * AccessEvent.qrToken
   */
  export type AccessEvent$qrTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QrToken
     */
    select?: QrTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QrToken
     */
    omit?: QrTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QrTokenInclude<ExtArgs> | null
    where?: QrTokenWhereInput
  }

  /**
   * AccessEvent without action
   */
  export type AccessEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccessEvent
     */
    select?: AccessEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccessEvent
     */
    omit?: AccessEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccessEventInclude<ExtArgs> | null
  }


  /**
   * Model DeviceRegistry
   */

  export type AggregateDeviceRegistry = {
    _count: DeviceRegistryCountAggregateOutputType | null
    _min: DeviceRegistryMinAggregateOutputType | null
    _max: DeviceRegistryMaxAggregateOutputType | null
  }

  export type DeviceRegistryMinAggregateOutputType = {
    id: string | null
    deviceCode: string | null
    name: string | null
    gateId: string | null
    deviceType: $Enums.DeviceType | null
    secretHash: string | null
    status: $Enums.DeviceStatus | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeviceRegistryMaxAggregateOutputType = {
    id: string | null
    deviceCode: string | null
    name: string | null
    gateId: string | null
    deviceType: $Enums.DeviceType | null
    secretHash: string | null
    status: $Enums.DeviceStatus | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeviceRegistryCountAggregateOutputType = {
    id: number
    deviceCode: number
    name: number
    gateId: number
    deviceType: number
    secretHash: number
    status: number
    lastSeenAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeviceRegistryMinAggregateInputType = {
    id?: true
    deviceCode?: true
    name?: true
    gateId?: true
    deviceType?: true
    secretHash?: true
    status?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeviceRegistryMaxAggregateInputType = {
    id?: true
    deviceCode?: true
    name?: true
    gateId?: true
    deviceType?: true
    secretHash?: true
    status?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeviceRegistryCountAggregateInputType = {
    id?: true
    deviceCode?: true
    name?: true
    gateId?: true
    deviceType?: true
    secretHash?: true
    status?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeviceRegistryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeviceRegistry to aggregate.
     */
    where?: DeviceRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceRegistries to fetch.
     */
    orderBy?: DeviceRegistryOrderByWithRelationInput | DeviceRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeviceRegistries
    **/
    _count?: true | DeviceRegistryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceRegistryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceRegistryMaxAggregateInputType
  }

  export type GetDeviceRegistryAggregateType<T extends DeviceRegistryAggregateArgs> = {
        [P in keyof T & keyof AggregateDeviceRegistry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeviceRegistry[P]>
      : GetScalarType<T[P], AggregateDeviceRegistry[P]>
  }




  export type DeviceRegistryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceRegistryWhereInput
    orderBy?: DeviceRegistryOrderByWithAggregationInput | DeviceRegistryOrderByWithAggregationInput[]
    by: DeviceRegistryScalarFieldEnum[] | DeviceRegistryScalarFieldEnum
    having?: DeviceRegistryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceRegistryCountAggregateInputType | true
    _min?: DeviceRegistryMinAggregateInputType
    _max?: DeviceRegistryMaxAggregateInputType
  }

  export type DeviceRegistryGroupByOutputType = {
    id: string
    deviceCode: string
    name: string
    gateId: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status: $Enums.DeviceStatus
    lastSeenAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DeviceRegistryCountAggregateOutputType | null
    _min: DeviceRegistryMinAggregateOutputType | null
    _max: DeviceRegistryMaxAggregateOutputType | null
  }

  type GetDeviceRegistryGroupByPayload<T extends DeviceRegistryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceRegistryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceRegistryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceRegistryGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceRegistryGroupByOutputType[P]>
        }
      >
    >


  export type DeviceRegistrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceCode?: boolean
    name?: boolean
    gateId?: boolean
    deviceType?: boolean
    secretHash?: boolean
    status?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gate?: boolean | GateDefaultArgs<ExtArgs>
    idCardSessions?: boolean | DeviceRegistry$idCardSessionsArgs<ExtArgs>
    _count?: boolean | DeviceRegistryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deviceRegistry"]>

  export type DeviceRegistrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceCode?: boolean
    name?: boolean
    gateId?: boolean
    deviceType?: boolean
    secretHash?: boolean
    status?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gate?: boolean | GateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deviceRegistry"]>

  export type DeviceRegistrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deviceCode?: boolean
    name?: boolean
    gateId?: boolean
    deviceType?: boolean
    secretHash?: boolean
    status?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gate?: boolean | GateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deviceRegistry"]>

  export type DeviceRegistrySelectScalar = {
    id?: boolean
    deviceCode?: boolean
    name?: boolean
    gateId?: boolean
    deviceType?: boolean
    secretHash?: boolean
    status?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeviceRegistryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deviceCode" | "name" | "gateId" | "deviceType" | "secretHash" | "status" | "lastSeenAt" | "createdAt" | "updatedAt", ExtArgs["result"]["deviceRegistry"]>
  export type DeviceRegistryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gate?: boolean | GateDefaultArgs<ExtArgs>
    idCardSessions?: boolean | DeviceRegistry$idCardSessionsArgs<ExtArgs>
    _count?: boolean | DeviceRegistryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DeviceRegistryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gate?: boolean | GateDefaultArgs<ExtArgs>
  }
  export type DeviceRegistryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gate?: boolean | GateDefaultArgs<ExtArgs>
  }

  export type $DeviceRegistryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeviceRegistry"
    objects: {
      gate: Prisma.$GatePayload<ExtArgs>
      idCardSessions: Prisma.$IdCardSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deviceCode: string
      name: string
      gateId: string
      deviceType: $Enums.DeviceType
      secretHash: string
      status: $Enums.DeviceStatus
      lastSeenAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["deviceRegistry"]>
    composites: {}
  }

  type DeviceRegistryGetPayload<S extends boolean | null | undefined | DeviceRegistryDefaultArgs> = $Result.GetResult<Prisma.$DeviceRegistryPayload, S>

  type DeviceRegistryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeviceRegistryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeviceRegistryCountAggregateInputType | true
    }

  export interface DeviceRegistryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeviceRegistry'], meta: { name: 'DeviceRegistry' } }
    /**
     * Find zero or one DeviceRegistry that matches the filter.
     * @param {DeviceRegistryFindUniqueArgs} args - Arguments to find a DeviceRegistry
     * @example
     * // Get one DeviceRegistry
     * const deviceRegistry = await prisma.deviceRegistry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceRegistryFindUniqueArgs>(args: SelectSubset<T, DeviceRegistryFindUniqueArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeviceRegistry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeviceRegistryFindUniqueOrThrowArgs} args - Arguments to find a DeviceRegistry
     * @example
     * // Get one DeviceRegistry
     * const deviceRegistry = await prisma.deviceRegistry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceRegistryFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceRegistryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeviceRegistry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryFindFirstArgs} args - Arguments to find a DeviceRegistry
     * @example
     * // Get one DeviceRegistry
     * const deviceRegistry = await prisma.deviceRegistry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceRegistryFindFirstArgs>(args?: SelectSubset<T, DeviceRegistryFindFirstArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeviceRegistry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryFindFirstOrThrowArgs} args - Arguments to find a DeviceRegistry
     * @example
     * // Get one DeviceRegistry
     * const deviceRegistry = await prisma.deviceRegistry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceRegistryFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceRegistryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeviceRegistries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeviceRegistries
     * const deviceRegistries = await prisma.deviceRegistry.findMany()
     * 
     * // Get first 10 DeviceRegistries
     * const deviceRegistries = await prisma.deviceRegistry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceRegistryWithIdOnly = await prisma.deviceRegistry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceRegistryFindManyArgs>(args?: SelectSubset<T, DeviceRegistryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeviceRegistry.
     * @param {DeviceRegistryCreateArgs} args - Arguments to create a DeviceRegistry.
     * @example
     * // Create one DeviceRegistry
     * const DeviceRegistry = await prisma.deviceRegistry.create({
     *   data: {
     *     // ... data to create a DeviceRegistry
     *   }
     * })
     * 
     */
    create<T extends DeviceRegistryCreateArgs>(args: SelectSubset<T, DeviceRegistryCreateArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeviceRegistries.
     * @param {DeviceRegistryCreateManyArgs} args - Arguments to create many DeviceRegistries.
     * @example
     * // Create many DeviceRegistries
     * const deviceRegistry = await prisma.deviceRegistry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceRegistryCreateManyArgs>(args?: SelectSubset<T, DeviceRegistryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeviceRegistries and returns the data saved in the database.
     * @param {DeviceRegistryCreateManyAndReturnArgs} args - Arguments to create many DeviceRegistries.
     * @example
     * // Create many DeviceRegistries
     * const deviceRegistry = await prisma.deviceRegistry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeviceRegistries and only return the `id`
     * const deviceRegistryWithIdOnly = await prisma.deviceRegistry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceRegistryCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceRegistryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeviceRegistry.
     * @param {DeviceRegistryDeleteArgs} args - Arguments to delete one DeviceRegistry.
     * @example
     * // Delete one DeviceRegistry
     * const DeviceRegistry = await prisma.deviceRegistry.delete({
     *   where: {
     *     // ... filter to delete one DeviceRegistry
     *   }
     * })
     * 
     */
    delete<T extends DeviceRegistryDeleteArgs>(args: SelectSubset<T, DeviceRegistryDeleteArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeviceRegistry.
     * @param {DeviceRegistryUpdateArgs} args - Arguments to update one DeviceRegistry.
     * @example
     * // Update one DeviceRegistry
     * const deviceRegistry = await prisma.deviceRegistry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceRegistryUpdateArgs>(args: SelectSubset<T, DeviceRegistryUpdateArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeviceRegistries.
     * @param {DeviceRegistryDeleteManyArgs} args - Arguments to filter DeviceRegistries to delete.
     * @example
     * // Delete a few DeviceRegistries
     * const { count } = await prisma.deviceRegistry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceRegistryDeleteManyArgs>(args?: SelectSubset<T, DeviceRegistryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeviceRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeviceRegistries
     * const deviceRegistry = await prisma.deviceRegistry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceRegistryUpdateManyArgs>(args: SelectSubset<T, DeviceRegistryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeviceRegistries and returns the data updated in the database.
     * @param {DeviceRegistryUpdateManyAndReturnArgs} args - Arguments to update many DeviceRegistries.
     * @example
     * // Update many DeviceRegistries
     * const deviceRegistry = await prisma.deviceRegistry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeviceRegistries and only return the `id`
     * const deviceRegistryWithIdOnly = await prisma.deviceRegistry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeviceRegistryUpdateManyAndReturnArgs>(args: SelectSubset<T, DeviceRegistryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeviceRegistry.
     * @param {DeviceRegistryUpsertArgs} args - Arguments to update or create a DeviceRegistry.
     * @example
     * // Update or create a DeviceRegistry
     * const deviceRegistry = await prisma.deviceRegistry.upsert({
     *   create: {
     *     // ... data to create a DeviceRegistry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeviceRegistry we want to update
     *   }
     * })
     */
    upsert<T extends DeviceRegistryUpsertArgs>(args: SelectSubset<T, DeviceRegistryUpsertArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeviceRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryCountArgs} args - Arguments to filter DeviceRegistries to count.
     * @example
     * // Count the number of DeviceRegistries
     * const count = await prisma.deviceRegistry.count({
     *   where: {
     *     // ... the filter for the DeviceRegistries we want to count
     *   }
     * })
    **/
    count<T extends DeviceRegistryCountArgs>(
      args?: Subset<T, DeviceRegistryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceRegistryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeviceRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeviceRegistryAggregateArgs>(args: Subset<T, DeviceRegistryAggregateArgs>): Prisma.PrismaPromise<GetDeviceRegistryAggregateType<T>>

    /**
     * Group by DeviceRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceRegistryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeviceRegistryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceRegistryGroupByArgs['orderBy'] }
        : { orderBy?: DeviceRegistryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeviceRegistryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceRegistryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeviceRegistry model
   */
  readonly fields: DeviceRegistryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeviceRegistry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceRegistryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gate<T extends GateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GateDefaultArgs<ExtArgs>>): Prisma__GateClient<$Result.GetResult<Prisma.$GatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    idCardSessions<T extends DeviceRegistry$idCardSessionsArgs<ExtArgs> = {}>(args?: Subset<T, DeviceRegistry$idCardSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DeviceRegistry model
   */
  interface DeviceRegistryFieldRefs {
    readonly id: FieldRef<"DeviceRegistry", 'String'>
    readonly deviceCode: FieldRef<"DeviceRegistry", 'String'>
    readonly name: FieldRef<"DeviceRegistry", 'String'>
    readonly gateId: FieldRef<"DeviceRegistry", 'String'>
    readonly deviceType: FieldRef<"DeviceRegistry", 'DeviceType'>
    readonly secretHash: FieldRef<"DeviceRegistry", 'String'>
    readonly status: FieldRef<"DeviceRegistry", 'DeviceStatus'>
    readonly lastSeenAt: FieldRef<"DeviceRegistry", 'DateTime'>
    readonly createdAt: FieldRef<"DeviceRegistry", 'DateTime'>
    readonly updatedAt: FieldRef<"DeviceRegistry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DeviceRegistry findUnique
   */
  export type DeviceRegistryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceRegistry to fetch.
     */
    where: DeviceRegistryWhereUniqueInput
  }

  /**
   * DeviceRegistry findUniqueOrThrow
   */
  export type DeviceRegistryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceRegistry to fetch.
     */
    where: DeviceRegistryWhereUniqueInput
  }

  /**
   * DeviceRegistry findFirst
   */
  export type DeviceRegistryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceRegistry to fetch.
     */
    where?: DeviceRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceRegistries to fetch.
     */
    orderBy?: DeviceRegistryOrderByWithRelationInput | DeviceRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeviceRegistries.
     */
    cursor?: DeviceRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeviceRegistries.
     */
    distinct?: DeviceRegistryScalarFieldEnum | DeviceRegistryScalarFieldEnum[]
  }

  /**
   * DeviceRegistry findFirstOrThrow
   */
  export type DeviceRegistryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceRegistry to fetch.
     */
    where?: DeviceRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceRegistries to fetch.
     */
    orderBy?: DeviceRegistryOrderByWithRelationInput | DeviceRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeviceRegistries.
     */
    cursor?: DeviceRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeviceRegistries.
     */
    distinct?: DeviceRegistryScalarFieldEnum | DeviceRegistryScalarFieldEnum[]
  }

  /**
   * DeviceRegistry findMany
   */
  export type DeviceRegistryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * Filter, which DeviceRegistries to fetch.
     */
    where?: DeviceRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeviceRegistries to fetch.
     */
    orderBy?: DeviceRegistryOrderByWithRelationInput | DeviceRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeviceRegistries.
     */
    cursor?: DeviceRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeviceRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeviceRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeviceRegistries.
     */
    distinct?: DeviceRegistryScalarFieldEnum | DeviceRegistryScalarFieldEnum[]
  }

  /**
   * DeviceRegistry create
   */
  export type DeviceRegistryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * The data needed to create a DeviceRegistry.
     */
    data: XOR<DeviceRegistryCreateInput, DeviceRegistryUncheckedCreateInput>
  }

  /**
   * DeviceRegistry createMany
   */
  export type DeviceRegistryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeviceRegistries.
     */
    data: DeviceRegistryCreateManyInput | DeviceRegistryCreateManyInput[]
  }

  /**
   * DeviceRegistry createManyAndReturn
   */
  export type DeviceRegistryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * The data used to create many DeviceRegistries.
     */
    data: DeviceRegistryCreateManyInput | DeviceRegistryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeviceRegistry update
   */
  export type DeviceRegistryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * The data needed to update a DeviceRegistry.
     */
    data: XOR<DeviceRegistryUpdateInput, DeviceRegistryUncheckedUpdateInput>
    /**
     * Choose, which DeviceRegistry to update.
     */
    where: DeviceRegistryWhereUniqueInput
  }

  /**
   * DeviceRegistry updateMany
   */
  export type DeviceRegistryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeviceRegistries.
     */
    data: XOR<DeviceRegistryUpdateManyMutationInput, DeviceRegistryUncheckedUpdateManyInput>
    /**
     * Filter which DeviceRegistries to update
     */
    where?: DeviceRegistryWhereInput
    /**
     * Limit how many DeviceRegistries to update.
     */
    limit?: number
  }

  /**
   * DeviceRegistry updateManyAndReturn
   */
  export type DeviceRegistryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * The data used to update DeviceRegistries.
     */
    data: XOR<DeviceRegistryUpdateManyMutationInput, DeviceRegistryUncheckedUpdateManyInput>
    /**
     * Filter which DeviceRegistries to update
     */
    where?: DeviceRegistryWhereInput
    /**
     * Limit how many DeviceRegistries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeviceRegistry upsert
   */
  export type DeviceRegistryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * The filter to search for the DeviceRegistry to update in case it exists.
     */
    where: DeviceRegistryWhereUniqueInput
    /**
     * In case the DeviceRegistry found by the `where` argument doesn't exist, create a new DeviceRegistry with this data.
     */
    create: XOR<DeviceRegistryCreateInput, DeviceRegistryUncheckedCreateInput>
    /**
     * In case the DeviceRegistry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceRegistryUpdateInput, DeviceRegistryUncheckedUpdateInput>
  }

  /**
   * DeviceRegistry delete
   */
  export type DeviceRegistryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    /**
     * Filter which DeviceRegistry to delete.
     */
    where: DeviceRegistryWhereUniqueInput
  }

  /**
   * DeviceRegistry deleteMany
   */
  export type DeviceRegistryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeviceRegistries to delete
     */
    where?: DeviceRegistryWhereInput
    /**
     * Limit how many DeviceRegistries to delete.
     */
    limit?: number
  }

  /**
   * DeviceRegistry.idCardSessions
   */
  export type DeviceRegistry$idCardSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    where?: IdCardSessionWhereInput
    orderBy?: IdCardSessionOrderByWithRelationInput | IdCardSessionOrderByWithRelationInput[]
    cursor?: IdCardSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IdCardSessionScalarFieldEnum | IdCardSessionScalarFieldEnum[]
  }

  /**
   * DeviceRegistry without action
   */
  export type DeviceRegistryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
  }


  /**
   * Model IdCardSession
   */

  export type AggregateIdCardSession = {
    _count: IdCardSessionCountAggregateOutputType | null
    _min: IdCardSessionMinAggregateOutputType | null
    _max: IdCardSessionMaxAggregateOutputType | null
  }

  export type IdCardSessionMinAggregateOutputType = {
    id: string | null
    memberId: string | null
    citizenId: string | null
    fullNameTh: string | null
    fullNameEn: string | null
    birthDate: Date | null
    address: string | null
    photoRead: boolean | null
    deviceId: string | null
    status: $Enums.IdCardReadStatus | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type IdCardSessionMaxAggregateOutputType = {
    id: string | null
    memberId: string | null
    citizenId: string | null
    fullNameTh: string | null
    fullNameEn: string | null
    birthDate: Date | null
    address: string | null
    photoRead: boolean | null
    deviceId: string | null
    status: $Enums.IdCardReadStatus | null
    readAt: Date | null
    createdAt: Date | null
  }

  export type IdCardSessionCountAggregateOutputType = {
    id: number
    memberId: number
    citizenId: number
    fullNameTh: number
    fullNameEn: number
    birthDate: number
    address: number
    photoRead: number
    deviceId: number
    status: number
    readAt: number
    createdAt: number
    _all: number
  }


  export type IdCardSessionMinAggregateInputType = {
    id?: true
    memberId?: true
    citizenId?: true
    fullNameTh?: true
    fullNameEn?: true
    birthDate?: true
    address?: true
    photoRead?: true
    deviceId?: true
    status?: true
    readAt?: true
    createdAt?: true
  }

  export type IdCardSessionMaxAggregateInputType = {
    id?: true
    memberId?: true
    citizenId?: true
    fullNameTh?: true
    fullNameEn?: true
    birthDate?: true
    address?: true
    photoRead?: true
    deviceId?: true
    status?: true
    readAt?: true
    createdAt?: true
  }

  export type IdCardSessionCountAggregateInputType = {
    id?: true
    memberId?: true
    citizenId?: true
    fullNameTh?: true
    fullNameEn?: true
    birthDate?: true
    address?: true
    photoRead?: true
    deviceId?: true
    status?: true
    readAt?: true
    createdAt?: true
    _all?: true
  }

  export type IdCardSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdCardSession to aggregate.
     */
    where?: IdCardSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdCardSessions to fetch.
     */
    orderBy?: IdCardSessionOrderByWithRelationInput | IdCardSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IdCardSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdCardSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdCardSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IdCardSessions
    **/
    _count?: true | IdCardSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IdCardSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IdCardSessionMaxAggregateInputType
  }

  export type GetIdCardSessionAggregateType<T extends IdCardSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateIdCardSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdCardSession[P]>
      : GetScalarType<T[P], AggregateIdCardSession[P]>
  }




  export type IdCardSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdCardSessionWhereInput
    orderBy?: IdCardSessionOrderByWithAggregationInput | IdCardSessionOrderByWithAggregationInput[]
    by: IdCardSessionScalarFieldEnum[] | IdCardSessionScalarFieldEnum
    having?: IdCardSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdCardSessionCountAggregateInputType | true
    _min?: IdCardSessionMinAggregateInputType
    _max?: IdCardSessionMaxAggregateInputType
  }

  export type IdCardSessionGroupByOutputType = {
    id: string
    memberId: string | null
    citizenId: string
    fullNameTh: string
    fullNameEn: string | null
    birthDate: Date | null
    address: string | null
    photoRead: boolean
    deviceId: string | null
    status: $Enums.IdCardReadStatus
    readAt: Date
    createdAt: Date
    _count: IdCardSessionCountAggregateOutputType | null
    _min: IdCardSessionMinAggregateOutputType | null
    _max: IdCardSessionMaxAggregateOutputType | null
  }

  type GetIdCardSessionGroupByPayload<T extends IdCardSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdCardSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IdCardSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IdCardSessionGroupByOutputType[P]>
            : GetScalarType<T[P], IdCardSessionGroupByOutputType[P]>
        }
      >
    >


  export type IdCardSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    citizenId?: boolean
    fullNameTh?: boolean
    fullNameEn?: boolean
    birthDate?: boolean
    address?: boolean
    photoRead?: boolean
    deviceId?: boolean
    status?: boolean
    readAt?: boolean
    createdAt?: boolean
    member?: boolean | IdCardSession$memberArgs<ExtArgs>
    device?: boolean | IdCardSession$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["idCardSession"]>

  export type IdCardSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    citizenId?: boolean
    fullNameTh?: boolean
    fullNameEn?: boolean
    birthDate?: boolean
    address?: boolean
    photoRead?: boolean
    deviceId?: boolean
    status?: boolean
    readAt?: boolean
    createdAt?: boolean
    member?: boolean | IdCardSession$memberArgs<ExtArgs>
    device?: boolean | IdCardSession$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["idCardSession"]>

  export type IdCardSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    memberId?: boolean
    citizenId?: boolean
    fullNameTh?: boolean
    fullNameEn?: boolean
    birthDate?: boolean
    address?: boolean
    photoRead?: boolean
    deviceId?: boolean
    status?: boolean
    readAt?: boolean
    createdAt?: boolean
    member?: boolean | IdCardSession$memberArgs<ExtArgs>
    device?: boolean | IdCardSession$deviceArgs<ExtArgs>
  }, ExtArgs["result"]["idCardSession"]>

  export type IdCardSessionSelectScalar = {
    id?: boolean
    memberId?: boolean
    citizenId?: boolean
    fullNameTh?: boolean
    fullNameEn?: boolean
    birthDate?: boolean
    address?: boolean
    photoRead?: boolean
    deviceId?: boolean
    status?: boolean
    readAt?: boolean
    createdAt?: boolean
  }

  export type IdCardSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "memberId" | "citizenId" | "fullNameTh" | "fullNameEn" | "birthDate" | "address" | "photoRead" | "deviceId" | "status" | "readAt" | "createdAt", ExtArgs["result"]["idCardSession"]>
  export type IdCardSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | IdCardSession$memberArgs<ExtArgs>
    device?: boolean | IdCardSession$deviceArgs<ExtArgs>
  }
  export type IdCardSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | IdCardSession$memberArgs<ExtArgs>
    device?: boolean | IdCardSession$deviceArgs<ExtArgs>
  }
  export type IdCardSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    member?: boolean | IdCardSession$memberArgs<ExtArgs>
    device?: boolean | IdCardSession$deviceArgs<ExtArgs>
  }

  export type $IdCardSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IdCardSession"
    objects: {
      member: Prisma.$MemberPayload<ExtArgs> | null
      device: Prisma.$DeviceRegistryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      memberId: string | null
      citizenId: string
      fullNameTh: string
      fullNameEn: string | null
      birthDate: Date | null
      address: string | null
      photoRead: boolean
      deviceId: string | null
      status: $Enums.IdCardReadStatus
      readAt: Date
      createdAt: Date
    }, ExtArgs["result"]["idCardSession"]>
    composites: {}
  }

  type IdCardSessionGetPayload<S extends boolean | null | undefined | IdCardSessionDefaultArgs> = $Result.GetResult<Prisma.$IdCardSessionPayload, S>

  type IdCardSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IdCardSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IdCardSessionCountAggregateInputType | true
    }

  export interface IdCardSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IdCardSession'], meta: { name: 'IdCardSession' } }
    /**
     * Find zero or one IdCardSession that matches the filter.
     * @param {IdCardSessionFindUniqueArgs} args - Arguments to find a IdCardSession
     * @example
     * // Get one IdCardSession
     * const idCardSession = await prisma.idCardSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdCardSessionFindUniqueArgs>(args: SelectSubset<T, IdCardSessionFindUniqueArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IdCardSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IdCardSessionFindUniqueOrThrowArgs} args - Arguments to find a IdCardSession
     * @example
     * // Get one IdCardSession
     * const idCardSession = await prisma.idCardSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdCardSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, IdCardSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IdCardSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionFindFirstArgs} args - Arguments to find a IdCardSession
     * @example
     * // Get one IdCardSession
     * const idCardSession = await prisma.idCardSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdCardSessionFindFirstArgs>(args?: SelectSubset<T, IdCardSessionFindFirstArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IdCardSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionFindFirstOrThrowArgs} args - Arguments to find a IdCardSession
     * @example
     * // Get one IdCardSession
     * const idCardSession = await prisma.idCardSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdCardSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, IdCardSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IdCardSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IdCardSessions
     * const idCardSessions = await prisma.idCardSession.findMany()
     * 
     * // Get first 10 IdCardSessions
     * const idCardSessions = await prisma.idCardSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const idCardSessionWithIdOnly = await prisma.idCardSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IdCardSessionFindManyArgs>(args?: SelectSubset<T, IdCardSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IdCardSession.
     * @param {IdCardSessionCreateArgs} args - Arguments to create a IdCardSession.
     * @example
     * // Create one IdCardSession
     * const IdCardSession = await prisma.idCardSession.create({
     *   data: {
     *     // ... data to create a IdCardSession
     *   }
     * })
     * 
     */
    create<T extends IdCardSessionCreateArgs>(args: SelectSubset<T, IdCardSessionCreateArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IdCardSessions.
     * @param {IdCardSessionCreateManyArgs} args - Arguments to create many IdCardSessions.
     * @example
     * // Create many IdCardSessions
     * const idCardSession = await prisma.idCardSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IdCardSessionCreateManyArgs>(args?: SelectSubset<T, IdCardSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IdCardSessions and returns the data saved in the database.
     * @param {IdCardSessionCreateManyAndReturnArgs} args - Arguments to create many IdCardSessions.
     * @example
     * // Create many IdCardSessions
     * const idCardSession = await prisma.idCardSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IdCardSessions and only return the `id`
     * const idCardSessionWithIdOnly = await prisma.idCardSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IdCardSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, IdCardSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IdCardSession.
     * @param {IdCardSessionDeleteArgs} args - Arguments to delete one IdCardSession.
     * @example
     * // Delete one IdCardSession
     * const IdCardSession = await prisma.idCardSession.delete({
     *   where: {
     *     // ... filter to delete one IdCardSession
     *   }
     * })
     * 
     */
    delete<T extends IdCardSessionDeleteArgs>(args: SelectSubset<T, IdCardSessionDeleteArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IdCardSession.
     * @param {IdCardSessionUpdateArgs} args - Arguments to update one IdCardSession.
     * @example
     * // Update one IdCardSession
     * const idCardSession = await prisma.idCardSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IdCardSessionUpdateArgs>(args: SelectSubset<T, IdCardSessionUpdateArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IdCardSessions.
     * @param {IdCardSessionDeleteManyArgs} args - Arguments to filter IdCardSessions to delete.
     * @example
     * // Delete a few IdCardSessions
     * const { count } = await prisma.idCardSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IdCardSessionDeleteManyArgs>(args?: SelectSubset<T, IdCardSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdCardSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IdCardSessions
     * const idCardSession = await prisma.idCardSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IdCardSessionUpdateManyArgs>(args: SelectSubset<T, IdCardSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdCardSessions and returns the data updated in the database.
     * @param {IdCardSessionUpdateManyAndReturnArgs} args - Arguments to update many IdCardSessions.
     * @example
     * // Update many IdCardSessions
     * const idCardSession = await prisma.idCardSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IdCardSessions and only return the `id`
     * const idCardSessionWithIdOnly = await prisma.idCardSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IdCardSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, IdCardSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IdCardSession.
     * @param {IdCardSessionUpsertArgs} args - Arguments to update or create a IdCardSession.
     * @example
     * // Update or create a IdCardSession
     * const idCardSession = await prisma.idCardSession.upsert({
     *   create: {
     *     // ... data to create a IdCardSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IdCardSession we want to update
     *   }
     * })
     */
    upsert<T extends IdCardSessionUpsertArgs>(args: SelectSubset<T, IdCardSessionUpsertArgs<ExtArgs>>): Prisma__IdCardSessionClient<$Result.GetResult<Prisma.$IdCardSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IdCardSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionCountArgs} args - Arguments to filter IdCardSessions to count.
     * @example
     * // Count the number of IdCardSessions
     * const count = await prisma.idCardSession.count({
     *   where: {
     *     // ... the filter for the IdCardSessions we want to count
     *   }
     * })
    **/
    count<T extends IdCardSessionCountArgs>(
      args?: Subset<T, IdCardSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdCardSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IdCardSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IdCardSessionAggregateArgs>(args: Subset<T, IdCardSessionAggregateArgs>): Prisma.PrismaPromise<GetIdCardSessionAggregateType<T>>

    /**
     * Group by IdCardSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdCardSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IdCardSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdCardSessionGroupByArgs['orderBy'] }
        : { orderBy?: IdCardSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IdCardSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdCardSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IdCardSession model
   */
  readonly fields: IdCardSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IdCardSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdCardSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    member<T extends IdCardSession$memberArgs<ExtArgs> = {}>(args?: Subset<T, IdCardSession$memberArgs<ExtArgs>>): Prisma__MemberClient<$Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    device<T extends IdCardSession$deviceArgs<ExtArgs> = {}>(args?: Subset<T, IdCardSession$deviceArgs<ExtArgs>>): Prisma__DeviceRegistryClient<$Result.GetResult<Prisma.$DeviceRegistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IdCardSession model
   */
  interface IdCardSessionFieldRefs {
    readonly id: FieldRef<"IdCardSession", 'String'>
    readonly memberId: FieldRef<"IdCardSession", 'String'>
    readonly citizenId: FieldRef<"IdCardSession", 'String'>
    readonly fullNameTh: FieldRef<"IdCardSession", 'String'>
    readonly fullNameEn: FieldRef<"IdCardSession", 'String'>
    readonly birthDate: FieldRef<"IdCardSession", 'DateTime'>
    readonly address: FieldRef<"IdCardSession", 'String'>
    readonly photoRead: FieldRef<"IdCardSession", 'Boolean'>
    readonly deviceId: FieldRef<"IdCardSession", 'String'>
    readonly status: FieldRef<"IdCardSession", 'IdCardReadStatus'>
    readonly readAt: FieldRef<"IdCardSession", 'DateTime'>
    readonly createdAt: FieldRef<"IdCardSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IdCardSession findUnique
   */
  export type IdCardSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * Filter, which IdCardSession to fetch.
     */
    where: IdCardSessionWhereUniqueInput
  }

  /**
   * IdCardSession findUniqueOrThrow
   */
  export type IdCardSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * Filter, which IdCardSession to fetch.
     */
    where: IdCardSessionWhereUniqueInput
  }

  /**
   * IdCardSession findFirst
   */
  export type IdCardSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * Filter, which IdCardSession to fetch.
     */
    where?: IdCardSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdCardSessions to fetch.
     */
    orderBy?: IdCardSessionOrderByWithRelationInput | IdCardSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdCardSessions.
     */
    cursor?: IdCardSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdCardSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdCardSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdCardSessions.
     */
    distinct?: IdCardSessionScalarFieldEnum | IdCardSessionScalarFieldEnum[]
  }

  /**
   * IdCardSession findFirstOrThrow
   */
  export type IdCardSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * Filter, which IdCardSession to fetch.
     */
    where?: IdCardSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdCardSessions to fetch.
     */
    orderBy?: IdCardSessionOrderByWithRelationInput | IdCardSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdCardSessions.
     */
    cursor?: IdCardSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdCardSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdCardSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdCardSessions.
     */
    distinct?: IdCardSessionScalarFieldEnum | IdCardSessionScalarFieldEnum[]
  }

  /**
   * IdCardSession findMany
   */
  export type IdCardSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * Filter, which IdCardSessions to fetch.
     */
    where?: IdCardSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdCardSessions to fetch.
     */
    orderBy?: IdCardSessionOrderByWithRelationInput | IdCardSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IdCardSessions.
     */
    cursor?: IdCardSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdCardSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdCardSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdCardSessions.
     */
    distinct?: IdCardSessionScalarFieldEnum | IdCardSessionScalarFieldEnum[]
  }

  /**
   * IdCardSession create
   */
  export type IdCardSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a IdCardSession.
     */
    data: XOR<IdCardSessionCreateInput, IdCardSessionUncheckedCreateInput>
  }

  /**
   * IdCardSession createMany
   */
  export type IdCardSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IdCardSessions.
     */
    data: IdCardSessionCreateManyInput | IdCardSessionCreateManyInput[]
  }

  /**
   * IdCardSession createManyAndReturn
   */
  export type IdCardSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * The data used to create many IdCardSessions.
     */
    data: IdCardSessionCreateManyInput | IdCardSessionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * IdCardSession update
   */
  export type IdCardSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a IdCardSession.
     */
    data: XOR<IdCardSessionUpdateInput, IdCardSessionUncheckedUpdateInput>
    /**
     * Choose, which IdCardSession to update.
     */
    where: IdCardSessionWhereUniqueInput
  }

  /**
   * IdCardSession updateMany
   */
  export type IdCardSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IdCardSessions.
     */
    data: XOR<IdCardSessionUpdateManyMutationInput, IdCardSessionUncheckedUpdateManyInput>
    /**
     * Filter which IdCardSessions to update
     */
    where?: IdCardSessionWhereInput
    /**
     * Limit how many IdCardSessions to update.
     */
    limit?: number
  }

  /**
   * IdCardSession updateManyAndReturn
   */
  export type IdCardSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * The data used to update IdCardSessions.
     */
    data: XOR<IdCardSessionUpdateManyMutationInput, IdCardSessionUncheckedUpdateManyInput>
    /**
     * Filter which IdCardSessions to update
     */
    where?: IdCardSessionWhereInput
    /**
     * Limit how many IdCardSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * IdCardSession upsert
   */
  export type IdCardSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the IdCardSession to update in case it exists.
     */
    where: IdCardSessionWhereUniqueInput
    /**
     * In case the IdCardSession found by the `where` argument doesn't exist, create a new IdCardSession with this data.
     */
    create: XOR<IdCardSessionCreateInput, IdCardSessionUncheckedCreateInput>
    /**
     * In case the IdCardSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdCardSessionUpdateInput, IdCardSessionUncheckedUpdateInput>
  }

  /**
   * IdCardSession delete
   */
  export type IdCardSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
    /**
     * Filter which IdCardSession to delete.
     */
    where: IdCardSessionWhereUniqueInput
  }

  /**
   * IdCardSession deleteMany
   */
  export type IdCardSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdCardSessions to delete
     */
    where?: IdCardSessionWhereInput
    /**
     * Limit how many IdCardSessions to delete.
     */
    limit?: number
  }

  /**
   * IdCardSession.member
   */
  export type IdCardSession$memberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Member
     */
    select?: MemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Member
     */
    omit?: MemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MemberInclude<ExtArgs> | null
    where?: MemberWhereInput
  }

  /**
   * IdCardSession.device
   */
  export type IdCardSession$deviceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeviceRegistry
     */
    select?: DeviceRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeviceRegistry
     */
    omit?: DeviceRegistryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceRegistryInclude<ExtArgs> | null
    where?: DeviceRegistryWhereInput
  }

  /**
   * IdCardSession without action
   */
  export type IdCardSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdCardSession
     */
    select?: IdCardSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdCardSession
     */
    omit?: IdCardSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IdCardSessionInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    resource: string | null
    resourceId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    resource: string | null
    resourceId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    resource: number
    resourceId: number
    dataBefore: number
    dataAfter: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    resource?: true
    resourceId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    resource?: true
    resourceId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    resource?: true
    resourceId?: true
    dataBefore?: true
    dataAfter?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    userId: string | null
    action: string
    resource: string
    resourceId: string | null
    dataBefore: JsonValue | null
    dataAfter: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    resource?: boolean
    resourceId?: boolean
    dataBefore?: boolean
    dataAfter?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    resource?: boolean
    resourceId?: boolean
    dataBefore?: boolean
    dataAfter?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    resource?: boolean
    resourceId?: boolean
    dataBefore?: boolean
    dataAfter?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    resource?: boolean
    resourceId?: boolean
    dataBefore?: boolean
    dataAfter?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "resource" | "resourceId" | "dataBefore" | "dataAfter" | "ipAddress" | "userAgent" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      action: string
      resource: string
      resourceId: string | null
      dataBefore: Prisma.JsonValue | null
      dataAfter: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly resource: FieldRef<"AuditLog", 'String'>
    readonly resourceId: FieldRef<"AuditLog", 'String'>
    readonly dataBefore: FieldRef<"AuditLog", 'Json'>
    readonly dataAfter: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    fullName: 'fullName',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BranchScalarFieldEnum: {
    id: 'id',
    code: 'code',
    nameTh: 'nameTh',
    nameEn: 'nameEn',
    nameZh: 'nameZh',
    address: 'address',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum]


  export const GateScalarFieldEnum: {
    id: 'id',
    gateCode: 'gateCode',
    nameTh: 'nameTh',
    nameEn: 'nameEn',
    nameZh: 'nameZh',
    branchId: 'branchId',
    direction: 'direction',
    status: 'status',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GateScalarFieldEnum = (typeof GateScalarFieldEnum)[keyof typeof GateScalarFieldEnum]


  export const MemberScalarFieldEnum: {
    id: 'id',
    memberNo: 'memberNo',
    citizenId: 'citizenId',
    firstNameTh: 'firstNameTh',
    lastNameTh: 'lastNameTh',
    firstNameEn: 'firstNameEn',
    lastNameEn: 'lastNameEn',
    firstNameZh: 'firstNameZh',
    lastNameZh: 'lastNameZh',
    email: 'email',
    phone: 'phone',
    memberType: 'memberType',
    status: 'status',
    expireDate: 'expireDate',
    photo: 'photo',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MemberScalarFieldEnum = (typeof MemberScalarFieldEnum)[keyof typeof MemberScalarFieldEnum]


  export const QrTokenScalarFieldEnum: {
    id: 'id',
    tokenHash: 'tokenHash',
    memberId: 'memberId',
    purpose: 'purpose',
    issuedDate: 'issuedDate',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    revokedAt: 'revokedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type QrTokenScalarFieldEnum = (typeof QrTokenScalarFieldEnum)[keyof typeof QrTokenScalarFieldEnum]


  export const QrPolicyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ttlSeconds: 'ttlSeconds',
    oneTimeUse: 'oneTimeUse',
    maxUsesPerDay: 'maxUsesPerDay',
    dailyStartTime: 'dailyStartTime',
    dailyEndTime: 'dailyEndTime',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type QrPolicyScalarFieldEnum = (typeof QrPolicyScalarFieldEnum)[keyof typeof QrPolicyScalarFieldEnum]


  export const AccessEventScalarFieldEnum: {
    id: 'id',
    gateId: 'gateId',
    memberId: 'memberId',
    qrTokenId: 'qrTokenId',
    direction: 'direction',
    source: 'source',
    decision: 'decision',
    reasonCode: 'reasonCode',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    metadata: 'metadata',
    scannedAt: 'scannedAt',
    createdAt: 'createdAt'
  };

  export type AccessEventScalarFieldEnum = (typeof AccessEventScalarFieldEnum)[keyof typeof AccessEventScalarFieldEnum]


  export const DeviceRegistryScalarFieldEnum: {
    id: 'id',
    deviceCode: 'deviceCode',
    name: 'name',
    gateId: 'gateId',
    deviceType: 'deviceType',
    secretHash: 'secretHash',
    status: 'status',
    lastSeenAt: 'lastSeenAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DeviceRegistryScalarFieldEnum = (typeof DeviceRegistryScalarFieldEnum)[keyof typeof DeviceRegistryScalarFieldEnum]


  export const IdCardSessionScalarFieldEnum: {
    id: 'id',
    memberId: 'memberId',
    citizenId: 'citizenId',
    fullNameTh: 'fullNameTh',
    fullNameEn: 'fullNameEn',
    birthDate: 'birthDate',
    address: 'address',
    photoRead: 'photoRead',
    deviceId: 'deviceId',
    status: 'status',
    readAt: 'readAt',
    createdAt: 'createdAt'
  };

  export type IdCardSessionScalarFieldEnum = (typeof IdCardSessionScalarFieldEnum)[keyof typeof IdCardSessionScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    resource: 'resource',
    resourceId: 'resourceId',
    dataBefore: 'dataBefore',
    dataAfter: 'dataAfter',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'GateDirection'
   */
  export type EnumGateDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GateDirection'>
    


  /**
   * Reference to a field of type 'GateStatus'
   */
  export type EnumGateStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GateStatus'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'MemberType'
   */
  export type EnumMemberTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MemberType'>
    


  /**
   * Reference to a field of type 'MemberStatus'
   */
  export type EnumMemberStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MemberStatus'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'QrPurpose'
   */
  export type EnumQrPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QrPurpose'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'AccessSource'
   */
  export type EnumAccessSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessSource'>
    


  /**
   * Reference to a field of type 'AccessDecision'
   */
  export type EnumAccessDecisionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccessDecision'>
    


  /**
   * Reference to a field of type 'DeviceType'
   */
  export type EnumDeviceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceType'>
    


  /**
   * Reference to a field of type 'DeviceStatus'
   */
  export type EnumDeviceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeviceStatus'>
    


  /**
   * Reference to a field of type 'IdCardReadStatus'
   */
  export type EnumIdCardReadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IdCardReadStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    auditLogs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type BranchWhereInput = {
    AND?: BranchWhereInput | BranchWhereInput[]
    OR?: BranchWhereInput[]
    NOT?: BranchWhereInput | BranchWhereInput[]
    id?: StringFilter<"Branch"> | string
    code?: StringFilter<"Branch"> | string
    nameTh?: StringFilter<"Branch"> | string
    nameEn?: StringFilter<"Branch"> | string
    nameZh?: StringFilter<"Branch"> | string
    address?: StringNullableFilter<"Branch"> | string | null
    isActive?: BoolFilter<"Branch"> | boolean
    createdAt?: DateTimeFilter<"Branch"> | Date | string
    gates?: GateListRelationFilter
  }

  export type BranchOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    address?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    gates?: GateOrderByRelationAggregateInput
  }

  export type BranchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: BranchWhereInput | BranchWhereInput[]
    OR?: BranchWhereInput[]
    NOT?: BranchWhereInput | BranchWhereInput[]
    nameTh?: StringFilter<"Branch"> | string
    nameEn?: StringFilter<"Branch"> | string
    nameZh?: StringFilter<"Branch"> | string
    address?: StringNullableFilter<"Branch"> | string | null
    isActive?: BoolFilter<"Branch"> | boolean
    createdAt?: DateTimeFilter<"Branch"> | Date | string
    gates?: GateListRelationFilter
  }, "id" | "code">

  export type BranchOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    address?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: BranchCountOrderByAggregateInput
    _max?: BranchMaxOrderByAggregateInput
    _min?: BranchMinOrderByAggregateInput
  }

  export type BranchScalarWhereWithAggregatesInput = {
    AND?: BranchScalarWhereWithAggregatesInput | BranchScalarWhereWithAggregatesInput[]
    OR?: BranchScalarWhereWithAggregatesInput[]
    NOT?: BranchScalarWhereWithAggregatesInput | BranchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Branch"> | string
    code?: StringWithAggregatesFilter<"Branch"> | string
    nameTh?: StringWithAggregatesFilter<"Branch"> | string
    nameEn?: StringWithAggregatesFilter<"Branch"> | string
    nameZh?: StringWithAggregatesFilter<"Branch"> | string
    address?: StringNullableWithAggregatesFilter<"Branch"> | string | null
    isActive?: BoolWithAggregatesFilter<"Branch"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Branch"> | Date | string
  }

  export type GateWhereInput = {
    AND?: GateWhereInput | GateWhereInput[]
    OR?: GateWhereInput[]
    NOT?: GateWhereInput | GateWhereInput[]
    id?: StringFilter<"Gate"> | string
    gateCode?: StringFilter<"Gate"> | string
    nameTh?: StringFilter<"Gate"> | string
    nameEn?: StringFilter<"Gate"> | string
    nameZh?: StringFilter<"Gate"> | string
    branchId?: StringFilter<"Gate"> | string
    direction?: EnumGateDirectionFilter<"Gate"> | $Enums.GateDirection
    status?: EnumGateStatusFilter<"Gate"> | $Enums.GateStatus
    metadata?: JsonNullableFilter<"Gate">
    createdAt?: DateTimeFilter<"Gate"> | Date | string
    updatedAt?: DateTimeFilter<"Gate"> | Date | string
    branch?: XOR<BranchScalarRelationFilter, BranchWhereInput>
    accessEvents?: AccessEventListRelationFilter
    devices?: DeviceRegistryListRelationFilter
  }

  export type GateOrderByWithRelationInput = {
    id?: SortOrder
    gateCode?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    branchId?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    branch?: BranchOrderByWithRelationInput
    accessEvents?: AccessEventOrderByRelationAggregateInput
    devices?: DeviceRegistryOrderByRelationAggregateInput
  }

  export type GateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gateCode?: string
    AND?: GateWhereInput | GateWhereInput[]
    OR?: GateWhereInput[]
    NOT?: GateWhereInput | GateWhereInput[]
    nameTh?: StringFilter<"Gate"> | string
    nameEn?: StringFilter<"Gate"> | string
    nameZh?: StringFilter<"Gate"> | string
    branchId?: StringFilter<"Gate"> | string
    direction?: EnumGateDirectionFilter<"Gate"> | $Enums.GateDirection
    status?: EnumGateStatusFilter<"Gate"> | $Enums.GateStatus
    metadata?: JsonNullableFilter<"Gate">
    createdAt?: DateTimeFilter<"Gate"> | Date | string
    updatedAt?: DateTimeFilter<"Gate"> | Date | string
    branch?: XOR<BranchScalarRelationFilter, BranchWhereInput>
    accessEvents?: AccessEventListRelationFilter
    devices?: DeviceRegistryListRelationFilter
  }, "id" | "gateCode">

  export type GateOrderByWithAggregationInput = {
    id?: SortOrder
    gateCode?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    branchId?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GateCountOrderByAggregateInput
    _max?: GateMaxOrderByAggregateInput
    _min?: GateMinOrderByAggregateInput
  }

  export type GateScalarWhereWithAggregatesInput = {
    AND?: GateScalarWhereWithAggregatesInput | GateScalarWhereWithAggregatesInput[]
    OR?: GateScalarWhereWithAggregatesInput[]
    NOT?: GateScalarWhereWithAggregatesInput | GateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Gate"> | string
    gateCode?: StringWithAggregatesFilter<"Gate"> | string
    nameTh?: StringWithAggregatesFilter<"Gate"> | string
    nameEn?: StringWithAggregatesFilter<"Gate"> | string
    nameZh?: StringWithAggregatesFilter<"Gate"> | string
    branchId?: StringWithAggregatesFilter<"Gate"> | string
    direction?: EnumGateDirectionWithAggregatesFilter<"Gate"> | $Enums.GateDirection
    status?: EnumGateStatusWithAggregatesFilter<"Gate"> | $Enums.GateStatus
    metadata?: JsonNullableWithAggregatesFilter<"Gate">
    createdAt?: DateTimeWithAggregatesFilter<"Gate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Gate"> | Date | string
  }

  export type MemberWhereInput = {
    AND?: MemberWhereInput | MemberWhereInput[]
    OR?: MemberWhereInput[]
    NOT?: MemberWhereInput | MemberWhereInput[]
    id?: StringFilter<"Member"> | string
    memberNo?: StringFilter<"Member"> | string
    citizenId?: StringNullableFilter<"Member"> | string | null
    firstNameTh?: StringFilter<"Member"> | string
    lastNameTh?: StringFilter<"Member"> | string
    firstNameEn?: StringNullableFilter<"Member"> | string | null
    lastNameEn?: StringNullableFilter<"Member"> | string | null
    firstNameZh?: StringNullableFilter<"Member"> | string | null
    lastNameZh?: StringNullableFilter<"Member"> | string | null
    email?: StringNullableFilter<"Member"> | string | null
    phone?: StringNullableFilter<"Member"> | string | null
    memberType?: EnumMemberTypeFilter<"Member"> | $Enums.MemberType
    status?: EnumMemberStatusFilter<"Member"> | $Enums.MemberStatus
    expireDate?: DateTimeNullableFilter<"Member"> | Date | string | null
    photo?: BytesNullableFilter<"Member"> | Bytes | null
    metadata?: JsonNullableFilter<"Member">
    createdAt?: DateTimeFilter<"Member"> | Date | string
    updatedAt?: DateTimeFilter<"Member"> | Date | string
    qrTokens?: QrTokenListRelationFilter
    accessEvents?: AccessEventListRelationFilter
    idCardSessions?: IdCardSessionListRelationFilter
  }

  export type MemberOrderByWithRelationInput = {
    id?: SortOrder
    memberNo?: SortOrder
    citizenId?: SortOrderInput | SortOrder
    firstNameTh?: SortOrder
    lastNameTh?: SortOrder
    firstNameEn?: SortOrderInput | SortOrder
    lastNameEn?: SortOrderInput | SortOrder
    firstNameZh?: SortOrderInput | SortOrder
    lastNameZh?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    memberType?: SortOrder
    status?: SortOrder
    expireDate?: SortOrderInput | SortOrder
    photo?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    qrTokens?: QrTokenOrderByRelationAggregateInput
    accessEvents?: AccessEventOrderByRelationAggregateInput
    idCardSessions?: IdCardSessionOrderByRelationAggregateInput
  }

  export type MemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    memberNo?: string
    citizenId?: string
    AND?: MemberWhereInput | MemberWhereInput[]
    OR?: MemberWhereInput[]
    NOT?: MemberWhereInput | MemberWhereInput[]
    firstNameTh?: StringFilter<"Member"> | string
    lastNameTh?: StringFilter<"Member"> | string
    firstNameEn?: StringNullableFilter<"Member"> | string | null
    lastNameEn?: StringNullableFilter<"Member"> | string | null
    firstNameZh?: StringNullableFilter<"Member"> | string | null
    lastNameZh?: StringNullableFilter<"Member"> | string | null
    email?: StringNullableFilter<"Member"> | string | null
    phone?: StringNullableFilter<"Member"> | string | null
    memberType?: EnumMemberTypeFilter<"Member"> | $Enums.MemberType
    status?: EnumMemberStatusFilter<"Member"> | $Enums.MemberStatus
    expireDate?: DateTimeNullableFilter<"Member"> | Date | string | null
    photo?: BytesNullableFilter<"Member"> | Bytes | null
    metadata?: JsonNullableFilter<"Member">
    createdAt?: DateTimeFilter<"Member"> | Date | string
    updatedAt?: DateTimeFilter<"Member"> | Date | string
    qrTokens?: QrTokenListRelationFilter
    accessEvents?: AccessEventListRelationFilter
    idCardSessions?: IdCardSessionListRelationFilter
  }, "id" | "memberNo" | "citizenId">

  export type MemberOrderByWithAggregationInput = {
    id?: SortOrder
    memberNo?: SortOrder
    citizenId?: SortOrderInput | SortOrder
    firstNameTh?: SortOrder
    lastNameTh?: SortOrder
    firstNameEn?: SortOrderInput | SortOrder
    lastNameEn?: SortOrderInput | SortOrder
    firstNameZh?: SortOrderInput | SortOrder
    lastNameZh?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    memberType?: SortOrder
    status?: SortOrder
    expireDate?: SortOrderInput | SortOrder
    photo?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MemberCountOrderByAggregateInput
    _max?: MemberMaxOrderByAggregateInput
    _min?: MemberMinOrderByAggregateInput
  }

  export type MemberScalarWhereWithAggregatesInput = {
    AND?: MemberScalarWhereWithAggregatesInput | MemberScalarWhereWithAggregatesInput[]
    OR?: MemberScalarWhereWithAggregatesInput[]
    NOT?: MemberScalarWhereWithAggregatesInput | MemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Member"> | string
    memberNo?: StringWithAggregatesFilter<"Member"> | string
    citizenId?: StringNullableWithAggregatesFilter<"Member"> | string | null
    firstNameTh?: StringWithAggregatesFilter<"Member"> | string
    lastNameTh?: StringWithAggregatesFilter<"Member"> | string
    firstNameEn?: StringNullableWithAggregatesFilter<"Member"> | string | null
    lastNameEn?: StringNullableWithAggregatesFilter<"Member"> | string | null
    firstNameZh?: StringNullableWithAggregatesFilter<"Member"> | string | null
    lastNameZh?: StringNullableWithAggregatesFilter<"Member"> | string | null
    email?: StringNullableWithAggregatesFilter<"Member"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Member"> | string | null
    memberType?: EnumMemberTypeWithAggregatesFilter<"Member"> | $Enums.MemberType
    status?: EnumMemberStatusWithAggregatesFilter<"Member"> | $Enums.MemberStatus
    expireDate?: DateTimeNullableWithAggregatesFilter<"Member"> | Date | string | null
    photo?: BytesNullableWithAggregatesFilter<"Member"> | Bytes | null
    metadata?: JsonNullableWithAggregatesFilter<"Member">
    createdAt?: DateTimeWithAggregatesFilter<"Member"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Member"> | Date | string
  }

  export type QrTokenWhereInput = {
    AND?: QrTokenWhereInput | QrTokenWhereInput[]
    OR?: QrTokenWhereInput[]
    NOT?: QrTokenWhereInput | QrTokenWhereInput[]
    id?: StringFilter<"QrToken"> | string
    tokenHash?: StringFilter<"QrToken"> | string
    memberId?: StringFilter<"QrToken"> | string
    purpose?: EnumQrPurposeFilter<"QrToken"> | $Enums.QrPurpose
    issuedDate?: DateTimeFilter<"QrToken"> | Date | string
    expiresAt?: DateTimeFilter<"QrToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"QrToken"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"QrToken"> | Date | string | null
    ipAddress?: StringNullableFilter<"QrToken"> | string | null
    userAgent?: StringNullableFilter<"QrToken"> | string | null
    createdAt?: DateTimeFilter<"QrToken"> | Date | string
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
    accessEvent?: XOR<AccessEventNullableScalarRelationFilter, AccessEventWhereInput> | null
  }

  export type QrTokenOrderByWithRelationInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    memberId?: SortOrder
    purpose?: SortOrder
    issuedDate?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    member?: MemberOrderByWithRelationInput
    accessEvent?: AccessEventOrderByWithRelationInput
  }

  export type QrTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: QrTokenWhereInput | QrTokenWhereInput[]
    OR?: QrTokenWhereInput[]
    NOT?: QrTokenWhereInput | QrTokenWhereInput[]
    memberId?: StringFilter<"QrToken"> | string
    purpose?: EnumQrPurposeFilter<"QrToken"> | $Enums.QrPurpose
    issuedDate?: DateTimeFilter<"QrToken"> | Date | string
    expiresAt?: DateTimeFilter<"QrToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"QrToken"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"QrToken"> | Date | string | null
    ipAddress?: StringNullableFilter<"QrToken"> | string | null
    userAgent?: StringNullableFilter<"QrToken"> | string | null
    createdAt?: DateTimeFilter<"QrToken"> | Date | string
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
    accessEvent?: XOR<AccessEventNullableScalarRelationFilter, AccessEventWhereInput> | null
  }, "id" | "tokenHash">

  export type QrTokenOrderByWithAggregationInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    memberId?: SortOrder
    purpose?: SortOrder
    issuedDate?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: QrTokenCountOrderByAggregateInput
    _max?: QrTokenMaxOrderByAggregateInput
    _min?: QrTokenMinOrderByAggregateInput
  }

  export type QrTokenScalarWhereWithAggregatesInput = {
    AND?: QrTokenScalarWhereWithAggregatesInput | QrTokenScalarWhereWithAggregatesInput[]
    OR?: QrTokenScalarWhereWithAggregatesInput[]
    NOT?: QrTokenScalarWhereWithAggregatesInput | QrTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QrToken"> | string
    tokenHash?: StringWithAggregatesFilter<"QrToken"> | string
    memberId?: StringWithAggregatesFilter<"QrToken"> | string
    purpose?: EnumQrPurposeWithAggregatesFilter<"QrToken"> | $Enums.QrPurpose
    issuedDate?: DateTimeWithAggregatesFilter<"QrToken"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"QrToken"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"QrToken"> | Date | string | null
    revokedAt?: DateTimeNullableWithAggregatesFilter<"QrToken"> | Date | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"QrToken"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"QrToken"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"QrToken"> | Date | string
  }

  export type QrPolicyWhereInput = {
    AND?: QrPolicyWhereInput | QrPolicyWhereInput[]
    OR?: QrPolicyWhereInput[]
    NOT?: QrPolicyWhereInput | QrPolicyWhereInput[]
    id?: StringFilter<"QrPolicy"> | string
    name?: StringFilter<"QrPolicy"> | string
    ttlSeconds?: IntFilter<"QrPolicy"> | number
    oneTimeUse?: BoolFilter<"QrPolicy"> | boolean
    maxUsesPerDay?: IntFilter<"QrPolicy"> | number
    dailyStartTime?: StringNullableFilter<"QrPolicy"> | string | null
    dailyEndTime?: StringNullableFilter<"QrPolicy"> | string | null
    isDefault?: BoolFilter<"QrPolicy"> | boolean
    createdAt?: DateTimeFilter<"QrPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"QrPolicy"> | Date | string
  }

  export type QrPolicyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ttlSeconds?: SortOrder
    oneTimeUse?: SortOrder
    maxUsesPerDay?: SortOrder
    dailyStartTime?: SortOrderInput | SortOrder
    dailyEndTime?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QrPolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: QrPolicyWhereInput | QrPolicyWhereInput[]
    OR?: QrPolicyWhereInput[]
    NOT?: QrPolicyWhereInput | QrPolicyWhereInput[]
    ttlSeconds?: IntFilter<"QrPolicy"> | number
    oneTimeUse?: BoolFilter<"QrPolicy"> | boolean
    maxUsesPerDay?: IntFilter<"QrPolicy"> | number
    dailyStartTime?: StringNullableFilter<"QrPolicy"> | string | null
    dailyEndTime?: StringNullableFilter<"QrPolicy"> | string | null
    isDefault?: BoolFilter<"QrPolicy"> | boolean
    createdAt?: DateTimeFilter<"QrPolicy"> | Date | string
    updatedAt?: DateTimeFilter<"QrPolicy"> | Date | string
  }, "id" | "name">

  export type QrPolicyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ttlSeconds?: SortOrder
    oneTimeUse?: SortOrder
    maxUsesPerDay?: SortOrder
    dailyStartTime?: SortOrderInput | SortOrder
    dailyEndTime?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: QrPolicyCountOrderByAggregateInput
    _avg?: QrPolicyAvgOrderByAggregateInput
    _max?: QrPolicyMaxOrderByAggregateInput
    _min?: QrPolicyMinOrderByAggregateInput
    _sum?: QrPolicySumOrderByAggregateInput
  }

  export type QrPolicyScalarWhereWithAggregatesInput = {
    AND?: QrPolicyScalarWhereWithAggregatesInput | QrPolicyScalarWhereWithAggregatesInput[]
    OR?: QrPolicyScalarWhereWithAggregatesInput[]
    NOT?: QrPolicyScalarWhereWithAggregatesInput | QrPolicyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QrPolicy"> | string
    name?: StringWithAggregatesFilter<"QrPolicy"> | string
    ttlSeconds?: IntWithAggregatesFilter<"QrPolicy"> | number
    oneTimeUse?: BoolWithAggregatesFilter<"QrPolicy"> | boolean
    maxUsesPerDay?: IntWithAggregatesFilter<"QrPolicy"> | number
    dailyStartTime?: StringNullableWithAggregatesFilter<"QrPolicy"> | string | null
    dailyEndTime?: StringNullableWithAggregatesFilter<"QrPolicy"> | string | null
    isDefault?: BoolWithAggregatesFilter<"QrPolicy"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"QrPolicy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"QrPolicy"> | Date | string
  }

  export type AccessEventWhereInput = {
    AND?: AccessEventWhereInput | AccessEventWhereInput[]
    OR?: AccessEventWhereInput[]
    NOT?: AccessEventWhereInput | AccessEventWhereInput[]
    id?: StringFilter<"AccessEvent"> | string
    gateId?: StringFilter<"AccessEvent"> | string
    memberId?: StringFilter<"AccessEvent"> | string
    qrTokenId?: StringNullableFilter<"AccessEvent"> | string | null
    direction?: EnumGateDirectionFilter<"AccessEvent"> | $Enums.GateDirection
    source?: EnumAccessSourceFilter<"AccessEvent"> | $Enums.AccessSource
    decision?: EnumAccessDecisionFilter<"AccessEvent"> | $Enums.AccessDecision
    reasonCode?: StringNullableFilter<"AccessEvent"> | string | null
    ipAddress?: StringNullableFilter<"AccessEvent"> | string | null
    userAgent?: StringNullableFilter<"AccessEvent"> | string | null
    metadata?: JsonNullableFilter<"AccessEvent">
    scannedAt?: DateTimeFilter<"AccessEvent"> | Date | string
    createdAt?: DateTimeFilter<"AccessEvent"> | Date | string
    gate?: XOR<GateScalarRelationFilter, GateWhereInput>
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
    qrToken?: XOR<QrTokenNullableScalarRelationFilter, QrTokenWhereInput> | null
  }

  export type AccessEventOrderByWithRelationInput = {
    id?: SortOrder
    gateId?: SortOrder
    memberId?: SortOrder
    qrTokenId?: SortOrderInput | SortOrder
    direction?: SortOrder
    source?: SortOrder
    decision?: SortOrder
    reasonCode?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    scannedAt?: SortOrder
    createdAt?: SortOrder
    gate?: GateOrderByWithRelationInput
    member?: MemberOrderByWithRelationInput
    qrToken?: QrTokenOrderByWithRelationInput
  }

  export type AccessEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    qrTokenId?: string
    AND?: AccessEventWhereInput | AccessEventWhereInput[]
    OR?: AccessEventWhereInput[]
    NOT?: AccessEventWhereInput | AccessEventWhereInput[]
    gateId?: StringFilter<"AccessEvent"> | string
    memberId?: StringFilter<"AccessEvent"> | string
    direction?: EnumGateDirectionFilter<"AccessEvent"> | $Enums.GateDirection
    source?: EnumAccessSourceFilter<"AccessEvent"> | $Enums.AccessSource
    decision?: EnumAccessDecisionFilter<"AccessEvent"> | $Enums.AccessDecision
    reasonCode?: StringNullableFilter<"AccessEvent"> | string | null
    ipAddress?: StringNullableFilter<"AccessEvent"> | string | null
    userAgent?: StringNullableFilter<"AccessEvent"> | string | null
    metadata?: JsonNullableFilter<"AccessEvent">
    scannedAt?: DateTimeFilter<"AccessEvent"> | Date | string
    createdAt?: DateTimeFilter<"AccessEvent"> | Date | string
    gate?: XOR<GateScalarRelationFilter, GateWhereInput>
    member?: XOR<MemberScalarRelationFilter, MemberWhereInput>
    qrToken?: XOR<QrTokenNullableScalarRelationFilter, QrTokenWhereInput> | null
  }, "id" | "qrTokenId">

  export type AccessEventOrderByWithAggregationInput = {
    id?: SortOrder
    gateId?: SortOrder
    memberId?: SortOrder
    qrTokenId?: SortOrderInput | SortOrder
    direction?: SortOrder
    source?: SortOrder
    decision?: SortOrder
    reasonCode?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    scannedAt?: SortOrder
    createdAt?: SortOrder
    _count?: AccessEventCountOrderByAggregateInput
    _max?: AccessEventMaxOrderByAggregateInput
    _min?: AccessEventMinOrderByAggregateInput
  }

  export type AccessEventScalarWhereWithAggregatesInput = {
    AND?: AccessEventScalarWhereWithAggregatesInput | AccessEventScalarWhereWithAggregatesInput[]
    OR?: AccessEventScalarWhereWithAggregatesInput[]
    NOT?: AccessEventScalarWhereWithAggregatesInput | AccessEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccessEvent"> | string
    gateId?: StringWithAggregatesFilter<"AccessEvent"> | string
    memberId?: StringWithAggregatesFilter<"AccessEvent"> | string
    qrTokenId?: StringNullableWithAggregatesFilter<"AccessEvent"> | string | null
    direction?: EnumGateDirectionWithAggregatesFilter<"AccessEvent"> | $Enums.GateDirection
    source?: EnumAccessSourceWithAggregatesFilter<"AccessEvent"> | $Enums.AccessSource
    decision?: EnumAccessDecisionWithAggregatesFilter<"AccessEvent"> | $Enums.AccessDecision
    reasonCode?: StringNullableWithAggregatesFilter<"AccessEvent"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AccessEvent"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AccessEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AccessEvent">
    scannedAt?: DateTimeWithAggregatesFilter<"AccessEvent"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"AccessEvent"> | Date | string
  }

  export type DeviceRegistryWhereInput = {
    AND?: DeviceRegistryWhereInput | DeviceRegistryWhereInput[]
    OR?: DeviceRegistryWhereInput[]
    NOT?: DeviceRegistryWhereInput | DeviceRegistryWhereInput[]
    id?: StringFilter<"DeviceRegistry"> | string
    deviceCode?: StringFilter<"DeviceRegistry"> | string
    name?: StringFilter<"DeviceRegistry"> | string
    gateId?: StringFilter<"DeviceRegistry"> | string
    deviceType?: EnumDeviceTypeFilter<"DeviceRegistry"> | $Enums.DeviceType
    secretHash?: StringFilter<"DeviceRegistry"> | string
    status?: EnumDeviceStatusFilter<"DeviceRegistry"> | $Enums.DeviceStatus
    lastSeenAt?: DateTimeNullableFilter<"DeviceRegistry"> | Date | string | null
    createdAt?: DateTimeFilter<"DeviceRegistry"> | Date | string
    updatedAt?: DateTimeFilter<"DeviceRegistry"> | Date | string
    gate?: XOR<GateScalarRelationFilter, GateWhereInput>
    idCardSessions?: IdCardSessionListRelationFilter
  }

  export type DeviceRegistryOrderByWithRelationInput = {
    id?: SortOrder
    deviceCode?: SortOrder
    name?: SortOrder
    gateId?: SortOrder
    deviceType?: SortOrder
    secretHash?: SortOrder
    status?: SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gate?: GateOrderByWithRelationInput
    idCardSessions?: IdCardSessionOrderByRelationAggregateInput
  }

  export type DeviceRegistryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deviceCode?: string
    AND?: DeviceRegistryWhereInput | DeviceRegistryWhereInput[]
    OR?: DeviceRegistryWhereInput[]
    NOT?: DeviceRegistryWhereInput | DeviceRegistryWhereInput[]
    name?: StringFilter<"DeviceRegistry"> | string
    gateId?: StringFilter<"DeviceRegistry"> | string
    deviceType?: EnumDeviceTypeFilter<"DeviceRegistry"> | $Enums.DeviceType
    secretHash?: StringFilter<"DeviceRegistry"> | string
    status?: EnumDeviceStatusFilter<"DeviceRegistry"> | $Enums.DeviceStatus
    lastSeenAt?: DateTimeNullableFilter<"DeviceRegistry"> | Date | string | null
    createdAt?: DateTimeFilter<"DeviceRegistry"> | Date | string
    updatedAt?: DateTimeFilter<"DeviceRegistry"> | Date | string
    gate?: XOR<GateScalarRelationFilter, GateWhereInput>
    idCardSessions?: IdCardSessionListRelationFilter
  }, "id" | "deviceCode">

  export type DeviceRegistryOrderByWithAggregationInput = {
    id?: SortOrder
    deviceCode?: SortOrder
    name?: SortOrder
    gateId?: SortOrder
    deviceType?: SortOrder
    secretHash?: SortOrder
    status?: SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeviceRegistryCountOrderByAggregateInput
    _max?: DeviceRegistryMaxOrderByAggregateInput
    _min?: DeviceRegistryMinOrderByAggregateInput
  }

  export type DeviceRegistryScalarWhereWithAggregatesInput = {
    AND?: DeviceRegistryScalarWhereWithAggregatesInput | DeviceRegistryScalarWhereWithAggregatesInput[]
    OR?: DeviceRegistryScalarWhereWithAggregatesInput[]
    NOT?: DeviceRegistryScalarWhereWithAggregatesInput | DeviceRegistryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DeviceRegistry"> | string
    deviceCode?: StringWithAggregatesFilter<"DeviceRegistry"> | string
    name?: StringWithAggregatesFilter<"DeviceRegistry"> | string
    gateId?: StringWithAggregatesFilter<"DeviceRegistry"> | string
    deviceType?: EnumDeviceTypeWithAggregatesFilter<"DeviceRegistry"> | $Enums.DeviceType
    secretHash?: StringWithAggregatesFilter<"DeviceRegistry"> | string
    status?: EnumDeviceStatusWithAggregatesFilter<"DeviceRegistry"> | $Enums.DeviceStatus
    lastSeenAt?: DateTimeNullableWithAggregatesFilter<"DeviceRegistry"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DeviceRegistry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DeviceRegistry"> | Date | string
  }

  export type IdCardSessionWhereInput = {
    AND?: IdCardSessionWhereInput | IdCardSessionWhereInput[]
    OR?: IdCardSessionWhereInput[]
    NOT?: IdCardSessionWhereInput | IdCardSessionWhereInput[]
    id?: StringFilter<"IdCardSession"> | string
    memberId?: StringNullableFilter<"IdCardSession"> | string | null
    citizenId?: StringFilter<"IdCardSession"> | string
    fullNameTh?: StringFilter<"IdCardSession"> | string
    fullNameEn?: StringNullableFilter<"IdCardSession"> | string | null
    birthDate?: DateTimeNullableFilter<"IdCardSession"> | Date | string | null
    address?: StringNullableFilter<"IdCardSession"> | string | null
    photoRead?: BoolFilter<"IdCardSession"> | boolean
    deviceId?: StringNullableFilter<"IdCardSession"> | string | null
    status?: EnumIdCardReadStatusFilter<"IdCardSession"> | $Enums.IdCardReadStatus
    readAt?: DateTimeFilter<"IdCardSession"> | Date | string
    createdAt?: DateTimeFilter<"IdCardSession"> | Date | string
    member?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    device?: XOR<DeviceRegistryNullableScalarRelationFilter, DeviceRegistryWhereInput> | null
  }

  export type IdCardSessionOrderByWithRelationInput = {
    id?: SortOrder
    memberId?: SortOrderInput | SortOrder
    citizenId?: SortOrder
    fullNameTh?: SortOrder
    fullNameEn?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    photoRead?: SortOrder
    deviceId?: SortOrderInput | SortOrder
    status?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
    member?: MemberOrderByWithRelationInput
    device?: DeviceRegistryOrderByWithRelationInput
  }

  export type IdCardSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IdCardSessionWhereInput | IdCardSessionWhereInput[]
    OR?: IdCardSessionWhereInput[]
    NOT?: IdCardSessionWhereInput | IdCardSessionWhereInput[]
    memberId?: StringNullableFilter<"IdCardSession"> | string | null
    citizenId?: StringFilter<"IdCardSession"> | string
    fullNameTh?: StringFilter<"IdCardSession"> | string
    fullNameEn?: StringNullableFilter<"IdCardSession"> | string | null
    birthDate?: DateTimeNullableFilter<"IdCardSession"> | Date | string | null
    address?: StringNullableFilter<"IdCardSession"> | string | null
    photoRead?: BoolFilter<"IdCardSession"> | boolean
    deviceId?: StringNullableFilter<"IdCardSession"> | string | null
    status?: EnumIdCardReadStatusFilter<"IdCardSession"> | $Enums.IdCardReadStatus
    readAt?: DateTimeFilter<"IdCardSession"> | Date | string
    createdAt?: DateTimeFilter<"IdCardSession"> | Date | string
    member?: XOR<MemberNullableScalarRelationFilter, MemberWhereInput> | null
    device?: XOR<DeviceRegistryNullableScalarRelationFilter, DeviceRegistryWhereInput> | null
  }, "id">

  export type IdCardSessionOrderByWithAggregationInput = {
    id?: SortOrder
    memberId?: SortOrderInput | SortOrder
    citizenId?: SortOrder
    fullNameTh?: SortOrder
    fullNameEn?: SortOrderInput | SortOrder
    birthDate?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    photoRead?: SortOrder
    deviceId?: SortOrderInput | SortOrder
    status?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
    _count?: IdCardSessionCountOrderByAggregateInput
    _max?: IdCardSessionMaxOrderByAggregateInput
    _min?: IdCardSessionMinOrderByAggregateInput
  }

  export type IdCardSessionScalarWhereWithAggregatesInput = {
    AND?: IdCardSessionScalarWhereWithAggregatesInput | IdCardSessionScalarWhereWithAggregatesInput[]
    OR?: IdCardSessionScalarWhereWithAggregatesInput[]
    NOT?: IdCardSessionScalarWhereWithAggregatesInput | IdCardSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IdCardSession"> | string
    memberId?: StringNullableWithAggregatesFilter<"IdCardSession"> | string | null
    citizenId?: StringWithAggregatesFilter<"IdCardSession"> | string
    fullNameTh?: StringWithAggregatesFilter<"IdCardSession"> | string
    fullNameEn?: StringNullableWithAggregatesFilter<"IdCardSession"> | string | null
    birthDate?: DateTimeNullableWithAggregatesFilter<"IdCardSession"> | Date | string | null
    address?: StringNullableWithAggregatesFilter<"IdCardSession"> | string | null
    photoRead?: BoolWithAggregatesFilter<"IdCardSession"> | boolean
    deviceId?: StringNullableWithAggregatesFilter<"IdCardSession"> | string | null
    status?: EnumIdCardReadStatusWithAggregatesFilter<"IdCardSession"> | $Enums.IdCardReadStatus
    readAt?: DateTimeWithAggregatesFilter<"IdCardSession"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"IdCardSession"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    resource?: StringFilter<"AuditLog"> | string
    resourceId?: StringNullableFilter<"AuditLog"> | string | null
    dataBefore?: JsonNullableFilter<"AuditLog">
    dataAfter?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    resource?: SortOrder
    resourceId?: SortOrderInput | SortOrder
    dataBefore?: SortOrderInput | SortOrder
    dataAfter?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    resource?: StringFilter<"AuditLog"> | string
    resourceId?: StringNullableFilter<"AuditLog"> | string | null
    dataBefore?: JsonNullableFilter<"AuditLog">
    dataAfter?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    resource?: SortOrder
    resourceId?: SortOrderInput | SortOrder
    dataBefore?: SortOrderInput | SortOrder
    dataAfter?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    resource?: StringWithAggregatesFilter<"AuditLog"> | string
    resourceId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    dataBefore?: JsonNullableWithAggregatesFilter<"AuditLog">
    dataAfter?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchCreateInput = {
    id?: string
    code: string
    nameTh: string
    nameEn: string
    nameZh: string
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    gates?: GateCreateNestedManyWithoutBranchInput
  }

  export type BranchUncheckedCreateInput = {
    id?: string
    code: string
    nameTh: string
    nameEn: string
    nameZh: string
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
    gates?: GateUncheckedCreateNestedManyWithoutBranchInput
  }

  export type BranchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gates?: GateUpdateManyWithoutBranchNestedInput
  }

  export type BranchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gates?: GateUncheckedUpdateManyWithoutBranchNestedInput
  }

  export type BranchCreateManyInput = {
    id?: string
    code: string
    nameTh: string
    nameEn: string
    nameZh: string
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type BranchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateCreateInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    branch: BranchCreateNestedOneWithoutGatesInput
    accessEvents?: AccessEventCreateNestedManyWithoutGateInput
    devices?: DeviceRegistryCreateNestedManyWithoutGateInput
  }

  export type GateUncheckedCreateInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    branchId: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    accessEvents?: AccessEventUncheckedCreateNestedManyWithoutGateInput
    devices?: DeviceRegistryUncheckedCreateNestedManyWithoutGateInput
  }

  export type GateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneRequiredWithoutGatesNestedInput
    accessEvents?: AccessEventUpdateManyWithoutGateNestedInput
    devices?: DeviceRegistryUpdateManyWithoutGateNestedInput
  }

  export type GateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    branchId?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvents?: AccessEventUncheckedUpdateManyWithoutGateNestedInput
    devices?: DeviceRegistryUncheckedUpdateManyWithoutGateNestedInput
  }

  export type GateCreateManyInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    branchId: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    branchId?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberCreateInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    qrTokens?: QrTokenCreateNestedManyWithoutMemberInput
    accessEvents?: AccessEventCreateNestedManyWithoutMemberInput
    idCardSessions?: IdCardSessionCreateNestedManyWithoutMemberInput
  }

  export type MemberUncheckedCreateInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    qrTokens?: QrTokenUncheckedCreateNestedManyWithoutMemberInput
    accessEvents?: AccessEventUncheckedCreateNestedManyWithoutMemberInput
    idCardSessions?: IdCardSessionUncheckedCreateNestedManyWithoutMemberInput
  }

  export type MemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrTokens?: QrTokenUpdateManyWithoutMemberNestedInput
    accessEvents?: AccessEventUpdateManyWithoutMemberNestedInput
    idCardSessions?: IdCardSessionUpdateManyWithoutMemberNestedInput
  }

  export type MemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrTokens?: QrTokenUncheckedUpdateManyWithoutMemberNestedInput
    accessEvents?: AccessEventUncheckedUpdateManyWithoutMemberNestedInput
    idCardSessions?: IdCardSessionUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type MemberCreateManyInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenCreateInput = {
    id?: string
    tokenHash: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    member: MemberCreateNestedOneWithoutQrTokensInput
    accessEvent?: AccessEventCreateNestedOneWithoutQrTokenInput
  }

  export type QrTokenUncheckedCreateInput = {
    id?: string
    tokenHash: string
    memberId: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    accessEvent?: AccessEventUncheckedCreateNestedOneWithoutQrTokenInput
  }

  export type QrTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneRequiredWithoutQrTokensNestedInput
    accessEvent?: AccessEventUpdateOneWithoutQrTokenNestedInput
  }

  export type QrTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvent?: AccessEventUncheckedUpdateOneWithoutQrTokenNestedInput
  }

  export type QrTokenCreateManyInput = {
    id?: string
    tokenHash: string
    memberId: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type QrTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrPolicyCreateInput = {
    id?: string
    name: string
    ttlSeconds?: number
    oneTimeUse?: boolean
    maxUsesPerDay?: number
    dailyStartTime?: string | null
    dailyEndTime?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QrPolicyUncheckedCreateInput = {
    id?: string
    name: string
    ttlSeconds?: number
    oneTimeUse?: boolean
    maxUsesPerDay?: number
    dailyStartTime?: string | null
    dailyEndTime?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QrPolicyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ttlSeconds?: IntFieldUpdateOperationsInput | number
    oneTimeUse?: BoolFieldUpdateOperationsInput | boolean
    maxUsesPerDay?: IntFieldUpdateOperationsInput | number
    dailyStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    dailyEndTime?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrPolicyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ttlSeconds?: IntFieldUpdateOperationsInput | number
    oneTimeUse?: BoolFieldUpdateOperationsInput | boolean
    maxUsesPerDay?: IntFieldUpdateOperationsInput | number
    dailyStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    dailyEndTime?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrPolicyCreateManyInput = {
    id?: string
    name: string
    ttlSeconds?: number
    oneTimeUse?: boolean
    maxUsesPerDay?: number
    dailyStartTime?: string | null
    dailyEndTime?: string | null
    isDefault?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type QrPolicyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ttlSeconds?: IntFieldUpdateOperationsInput | number
    oneTimeUse?: BoolFieldUpdateOperationsInput | boolean
    maxUsesPerDay?: IntFieldUpdateOperationsInput | number
    dailyStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    dailyEndTime?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrPolicyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    ttlSeconds?: IntFieldUpdateOperationsInput | number
    oneTimeUse?: BoolFieldUpdateOperationsInput | boolean
    maxUsesPerDay?: IntFieldUpdateOperationsInput | number
    dailyStartTime?: NullableStringFieldUpdateOperationsInput | string | null
    dailyEndTime?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventCreateInput = {
    id?: string
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
    gate: GateCreateNestedOneWithoutAccessEventsInput
    member: MemberCreateNestedOneWithoutAccessEventsInput
    qrToken?: QrTokenCreateNestedOneWithoutAccessEventInput
  }

  export type AccessEventUncheckedCreateInput = {
    id?: string
    gateId: string
    memberId: string
    qrTokenId?: string | null
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type AccessEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gate?: GateUpdateOneRequiredWithoutAccessEventsNestedInput
    member?: MemberUpdateOneRequiredWithoutAccessEventsNestedInput
    qrToken?: QrTokenUpdateOneWithoutAccessEventNestedInput
  }

  export type AccessEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    qrTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventCreateManyInput = {
    id?: string
    gateId: string
    memberId: string
    qrTokenId?: string | null
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type AccessEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    qrTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceRegistryCreateInput = {
    id?: string
    deviceCode: string
    name: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    gate: GateCreateNestedOneWithoutDevicesInput
    idCardSessions?: IdCardSessionCreateNestedManyWithoutDeviceInput
  }

  export type DeviceRegistryUncheckedCreateInput = {
    id?: string
    deviceCode: string
    name: string
    gateId: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    idCardSessions?: IdCardSessionUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceRegistryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gate?: GateUpdateOneRequiredWithoutDevicesNestedInput
    idCardSessions?: IdCardSessionUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceRegistryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idCardSessions?: IdCardSessionUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceRegistryCreateManyInput = {
    id?: string
    deviceCode: string
    name: string
    gateId: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeviceRegistryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceRegistryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionCreateInput = {
    id?: string
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
    member?: MemberCreateNestedOneWithoutIdCardSessionsInput
    device?: DeviceRegistryCreateNestedOneWithoutIdCardSessionsInput
  }

  export type IdCardSessionUncheckedCreateInput = {
    id?: string
    memberId?: string | null
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    deviceId?: string | null
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
  }

  export type IdCardSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneWithoutIdCardSessionsNestedInput
    device?: DeviceRegistryUpdateOneWithoutIdCardSessionsNestedInput
  }

  export type IdCardSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionCreateManyInput = {
    id?: string
    memberId?: string | null
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    deviceId?: string | null
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
  }

  export type IdCardSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: string
    resource: string
    resourceId?: string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    userId?: string | null
    action: string
    resource: string
    resourceId?: string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    userId?: string | null
    action: string
    resource: string
    resourceId?: string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    fullName?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type GateListRelationFilter = {
    every?: GateWhereInput
    some?: GateWhereInput
    none?: GateWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BranchCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type BranchMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type BranchMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    address?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumGateDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.GateDirection | EnumGateDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.GateDirection[]
    notIn?: $Enums.GateDirection[]
    not?: NestedEnumGateDirectionFilter<$PrismaModel> | $Enums.GateDirection
  }

  export type EnumGateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GateStatus | EnumGateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GateStatus[]
    notIn?: $Enums.GateStatus[]
    not?: NestedEnumGateStatusFilter<$PrismaModel> | $Enums.GateStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BranchScalarRelationFilter = {
    is?: BranchWhereInput
    isNot?: BranchWhereInput
  }

  export type AccessEventListRelationFilter = {
    every?: AccessEventWhereInput
    some?: AccessEventWhereInput
    none?: AccessEventWhereInput
  }

  export type DeviceRegistryListRelationFilter = {
    every?: DeviceRegistryWhereInput
    some?: DeviceRegistryWhereInput
    none?: DeviceRegistryWhereInput
  }

  export type AccessEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeviceRegistryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GateCountOrderByAggregateInput = {
    id?: SortOrder
    gateCode?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    branchId?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GateMaxOrderByAggregateInput = {
    id?: SortOrder
    gateCode?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    branchId?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GateMinOrderByAggregateInput = {
    id?: SortOrder
    gateCode?: SortOrder
    nameTh?: SortOrder
    nameEn?: SortOrder
    nameZh?: SortOrder
    branchId?: SortOrder
    direction?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumGateDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GateDirection | EnumGateDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.GateDirection[]
    notIn?: $Enums.GateDirection[]
    not?: NestedEnumGateDirectionWithAggregatesFilter<$PrismaModel> | $Enums.GateDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGateDirectionFilter<$PrismaModel>
    _max?: NestedEnumGateDirectionFilter<$PrismaModel>
  }

  export type EnumGateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GateStatus | EnumGateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GateStatus[]
    notIn?: $Enums.GateStatus[]
    not?: NestedEnumGateStatusWithAggregatesFilter<$PrismaModel> | $Enums.GateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGateStatusFilter<$PrismaModel>
    _max?: NestedEnumGateStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumMemberTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberType | EnumMemberTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MemberType[]
    notIn?: $Enums.MemberType[]
    not?: NestedEnumMemberTypeFilter<$PrismaModel> | $Enums.MemberType
  }

  export type EnumMemberStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberStatus | EnumMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MemberStatus[]
    notIn?: $Enums.MemberStatus[]
    not?: NestedEnumMemberStatusFilter<$PrismaModel> | $Enums.MemberStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BytesNullableFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | null
    notIn?: Bytes[] | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Bytes | null
  }

  export type QrTokenListRelationFilter = {
    every?: QrTokenWhereInput
    some?: QrTokenWhereInput
    none?: QrTokenWhereInput
  }

  export type IdCardSessionListRelationFilter = {
    every?: IdCardSessionWhereInput
    some?: IdCardSessionWhereInput
    none?: IdCardSessionWhereInput
  }

  export type QrTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IdCardSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MemberCountOrderByAggregateInput = {
    id?: SortOrder
    memberNo?: SortOrder
    citizenId?: SortOrder
    firstNameTh?: SortOrder
    lastNameTh?: SortOrder
    firstNameEn?: SortOrder
    lastNameEn?: SortOrder
    firstNameZh?: SortOrder
    lastNameZh?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    memberType?: SortOrder
    status?: SortOrder
    expireDate?: SortOrder
    photo?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberMaxOrderByAggregateInput = {
    id?: SortOrder
    memberNo?: SortOrder
    citizenId?: SortOrder
    firstNameTh?: SortOrder
    lastNameTh?: SortOrder
    firstNameEn?: SortOrder
    lastNameEn?: SortOrder
    firstNameZh?: SortOrder
    lastNameZh?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    memberType?: SortOrder
    status?: SortOrder
    expireDate?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MemberMinOrderByAggregateInput = {
    id?: SortOrder
    memberNo?: SortOrder
    citizenId?: SortOrder
    firstNameTh?: SortOrder
    lastNameTh?: SortOrder
    firstNameEn?: SortOrder
    lastNameEn?: SortOrder
    firstNameZh?: SortOrder
    lastNameZh?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    memberType?: SortOrder
    status?: SortOrder
    expireDate?: SortOrder
    photo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumMemberTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberType | EnumMemberTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MemberType[]
    notIn?: $Enums.MemberType[]
    not?: NestedEnumMemberTypeWithAggregatesFilter<$PrismaModel> | $Enums.MemberType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberTypeFilter<$PrismaModel>
    _max?: NestedEnumMemberTypeFilter<$PrismaModel>
  }

  export type EnumMemberStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberStatus | EnumMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MemberStatus[]
    notIn?: $Enums.MemberStatus[]
    not?: NestedEnumMemberStatusWithAggregatesFilter<$PrismaModel> | $Enums.MemberStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberStatusFilter<$PrismaModel>
    _max?: NestedEnumMemberStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | null
    notIn?: Bytes[] | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Bytes | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type EnumQrPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.QrPurpose | EnumQrPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.QrPurpose[]
    notIn?: $Enums.QrPurpose[]
    not?: NestedEnumQrPurposeFilter<$PrismaModel> | $Enums.QrPurpose
  }

  export type MemberScalarRelationFilter = {
    is?: MemberWhereInput
    isNot?: MemberWhereInput
  }

  export type AccessEventNullableScalarRelationFilter = {
    is?: AccessEventWhereInput | null
    isNot?: AccessEventWhereInput | null
  }

  export type QrTokenCountOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    memberId?: SortOrder
    purpose?: SortOrder
    issuedDate?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    revokedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type QrTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    memberId?: SortOrder
    purpose?: SortOrder
    issuedDate?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    revokedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type QrTokenMinOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    memberId?: SortOrder
    purpose?: SortOrder
    issuedDate?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    revokedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumQrPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QrPurpose | EnumQrPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.QrPurpose[]
    notIn?: $Enums.QrPurpose[]
    not?: NestedEnumQrPurposeWithAggregatesFilter<$PrismaModel> | $Enums.QrPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQrPurposeFilter<$PrismaModel>
    _max?: NestedEnumQrPurposeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type QrPolicyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ttlSeconds?: SortOrder
    oneTimeUse?: SortOrder
    maxUsesPerDay?: SortOrder
    dailyStartTime?: SortOrder
    dailyEndTime?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QrPolicyAvgOrderByAggregateInput = {
    ttlSeconds?: SortOrder
    maxUsesPerDay?: SortOrder
  }

  export type QrPolicyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ttlSeconds?: SortOrder
    oneTimeUse?: SortOrder
    maxUsesPerDay?: SortOrder
    dailyStartTime?: SortOrder
    dailyEndTime?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QrPolicyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ttlSeconds?: SortOrder
    oneTimeUse?: SortOrder
    maxUsesPerDay?: SortOrder
    dailyStartTime?: SortOrder
    dailyEndTime?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type QrPolicySumOrderByAggregateInput = {
    ttlSeconds?: SortOrder
    maxUsesPerDay?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumAccessSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessSource | EnumAccessSourceFieldRefInput<$PrismaModel>
    in?: $Enums.AccessSource[]
    notIn?: $Enums.AccessSource[]
    not?: NestedEnumAccessSourceFilter<$PrismaModel> | $Enums.AccessSource
  }

  export type EnumAccessDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessDecision | EnumAccessDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.AccessDecision[]
    notIn?: $Enums.AccessDecision[]
    not?: NestedEnumAccessDecisionFilter<$PrismaModel> | $Enums.AccessDecision
  }

  export type GateScalarRelationFilter = {
    is?: GateWhereInput
    isNot?: GateWhereInput
  }

  export type QrTokenNullableScalarRelationFilter = {
    is?: QrTokenWhereInput | null
    isNot?: QrTokenWhereInput | null
  }

  export type AccessEventCountOrderByAggregateInput = {
    id?: SortOrder
    gateId?: SortOrder
    memberId?: SortOrder
    qrTokenId?: SortOrder
    direction?: SortOrder
    source?: SortOrder
    decision?: SortOrder
    reasonCode?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    metadata?: SortOrder
    scannedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AccessEventMaxOrderByAggregateInput = {
    id?: SortOrder
    gateId?: SortOrder
    memberId?: SortOrder
    qrTokenId?: SortOrder
    direction?: SortOrder
    source?: SortOrder
    decision?: SortOrder
    reasonCode?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    scannedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AccessEventMinOrderByAggregateInput = {
    id?: SortOrder
    gateId?: SortOrder
    memberId?: SortOrder
    qrTokenId?: SortOrder
    direction?: SortOrder
    source?: SortOrder
    decision?: SortOrder
    reasonCode?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    scannedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAccessSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessSource | EnumAccessSourceFieldRefInput<$PrismaModel>
    in?: $Enums.AccessSource[]
    notIn?: $Enums.AccessSource[]
    not?: NestedEnumAccessSourceWithAggregatesFilter<$PrismaModel> | $Enums.AccessSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessSourceFilter<$PrismaModel>
    _max?: NestedEnumAccessSourceFilter<$PrismaModel>
  }

  export type EnumAccessDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessDecision | EnumAccessDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.AccessDecision[]
    notIn?: $Enums.AccessDecision[]
    not?: NestedEnumAccessDecisionWithAggregatesFilter<$PrismaModel> | $Enums.AccessDecision
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessDecisionFilter<$PrismaModel>
    _max?: NestedEnumAccessDecisionFilter<$PrismaModel>
  }

  export type EnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type EnumDeviceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[]
    notIn?: $Enums.DeviceStatus[]
    not?: NestedEnumDeviceStatusFilter<$PrismaModel> | $Enums.DeviceStatus
  }

  export type DeviceRegistryCountOrderByAggregateInput = {
    id?: SortOrder
    deviceCode?: SortOrder
    name?: SortOrder
    gateId?: SortOrder
    deviceType?: SortOrder
    secretHash?: SortOrder
    status?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeviceRegistryMaxOrderByAggregateInput = {
    id?: SortOrder
    deviceCode?: SortOrder
    name?: SortOrder
    gateId?: SortOrder
    deviceType?: SortOrder
    secretHash?: SortOrder
    status?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeviceRegistryMinOrderByAggregateInput = {
    id?: SortOrder
    deviceCode?: SortOrder
    name?: SortOrder
    gateId?: SortOrder
    deviceType?: SortOrder
    secretHash?: SortOrder
    status?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type EnumDeviceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[]
    notIn?: $Enums.DeviceStatus[]
    not?: NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeviceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceStatusFilter<$PrismaModel>
    _max?: NestedEnumDeviceStatusFilter<$PrismaModel>
  }

  export type EnumIdCardReadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IdCardReadStatus | EnumIdCardReadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IdCardReadStatus[]
    notIn?: $Enums.IdCardReadStatus[]
    not?: NestedEnumIdCardReadStatusFilter<$PrismaModel> | $Enums.IdCardReadStatus
  }

  export type MemberNullableScalarRelationFilter = {
    is?: MemberWhereInput | null
    isNot?: MemberWhereInput | null
  }

  export type DeviceRegistryNullableScalarRelationFilter = {
    is?: DeviceRegistryWhereInput | null
    isNot?: DeviceRegistryWhereInput | null
  }

  export type IdCardSessionCountOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    citizenId?: SortOrder
    fullNameTh?: SortOrder
    fullNameEn?: SortOrder
    birthDate?: SortOrder
    address?: SortOrder
    photoRead?: SortOrder
    deviceId?: SortOrder
    status?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type IdCardSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    citizenId?: SortOrder
    fullNameTh?: SortOrder
    fullNameEn?: SortOrder
    birthDate?: SortOrder
    address?: SortOrder
    photoRead?: SortOrder
    deviceId?: SortOrder
    status?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type IdCardSessionMinOrderByAggregateInput = {
    id?: SortOrder
    memberId?: SortOrder
    citizenId?: SortOrder
    fullNameTh?: SortOrder
    fullNameEn?: SortOrder
    birthDate?: SortOrder
    address?: SortOrder
    photoRead?: SortOrder
    deviceId?: SortOrder
    status?: SortOrder
    readAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumIdCardReadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IdCardReadStatus | EnumIdCardReadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IdCardReadStatus[]
    notIn?: $Enums.IdCardReadStatus[]
    not?: NestedEnumIdCardReadStatusWithAggregatesFilter<$PrismaModel> | $Enums.IdCardReadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIdCardReadStatusFilter<$PrismaModel>
    _max?: NestedEnumIdCardReadStatusFilter<$PrismaModel>
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resource?: SortOrder
    resourceId?: SortOrder
    dataBefore?: SortOrder
    dataAfter?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resource?: SortOrder
    resourceId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    resource?: SortOrder
    resourceId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type GateCreateNestedManyWithoutBranchInput = {
    create?: XOR<GateCreateWithoutBranchInput, GateUncheckedCreateWithoutBranchInput> | GateCreateWithoutBranchInput[] | GateUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GateCreateOrConnectWithoutBranchInput | GateCreateOrConnectWithoutBranchInput[]
    createMany?: GateCreateManyBranchInputEnvelope
    connect?: GateWhereUniqueInput | GateWhereUniqueInput[]
  }

  export type GateUncheckedCreateNestedManyWithoutBranchInput = {
    create?: XOR<GateCreateWithoutBranchInput, GateUncheckedCreateWithoutBranchInput> | GateCreateWithoutBranchInput[] | GateUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GateCreateOrConnectWithoutBranchInput | GateCreateOrConnectWithoutBranchInput[]
    createMany?: GateCreateManyBranchInputEnvelope
    connect?: GateWhereUniqueInput | GateWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type GateUpdateManyWithoutBranchNestedInput = {
    create?: XOR<GateCreateWithoutBranchInput, GateUncheckedCreateWithoutBranchInput> | GateCreateWithoutBranchInput[] | GateUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GateCreateOrConnectWithoutBranchInput | GateCreateOrConnectWithoutBranchInput[]
    upsert?: GateUpsertWithWhereUniqueWithoutBranchInput | GateUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: GateCreateManyBranchInputEnvelope
    set?: GateWhereUniqueInput | GateWhereUniqueInput[]
    disconnect?: GateWhereUniqueInput | GateWhereUniqueInput[]
    delete?: GateWhereUniqueInput | GateWhereUniqueInput[]
    connect?: GateWhereUniqueInput | GateWhereUniqueInput[]
    update?: GateUpdateWithWhereUniqueWithoutBranchInput | GateUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: GateUpdateManyWithWhereWithoutBranchInput | GateUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: GateScalarWhereInput | GateScalarWhereInput[]
  }

  export type GateUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: XOR<GateCreateWithoutBranchInput, GateUncheckedCreateWithoutBranchInput> | GateCreateWithoutBranchInput[] | GateUncheckedCreateWithoutBranchInput[]
    connectOrCreate?: GateCreateOrConnectWithoutBranchInput | GateCreateOrConnectWithoutBranchInput[]
    upsert?: GateUpsertWithWhereUniqueWithoutBranchInput | GateUpsertWithWhereUniqueWithoutBranchInput[]
    createMany?: GateCreateManyBranchInputEnvelope
    set?: GateWhereUniqueInput | GateWhereUniqueInput[]
    disconnect?: GateWhereUniqueInput | GateWhereUniqueInput[]
    delete?: GateWhereUniqueInput | GateWhereUniqueInput[]
    connect?: GateWhereUniqueInput | GateWhereUniqueInput[]
    update?: GateUpdateWithWhereUniqueWithoutBranchInput | GateUpdateWithWhereUniqueWithoutBranchInput[]
    updateMany?: GateUpdateManyWithWhereWithoutBranchInput | GateUpdateManyWithWhereWithoutBranchInput[]
    deleteMany?: GateScalarWhereInput | GateScalarWhereInput[]
  }

  export type BranchCreateNestedOneWithoutGatesInput = {
    create?: XOR<BranchCreateWithoutGatesInput, BranchUncheckedCreateWithoutGatesInput>
    connectOrCreate?: BranchCreateOrConnectWithoutGatesInput
    connect?: BranchWhereUniqueInput
  }

  export type AccessEventCreateNestedManyWithoutGateInput = {
    create?: XOR<AccessEventCreateWithoutGateInput, AccessEventUncheckedCreateWithoutGateInput> | AccessEventCreateWithoutGateInput[] | AccessEventUncheckedCreateWithoutGateInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutGateInput | AccessEventCreateOrConnectWithoutGateInput[]
    createMany?: AccessEventCreateManyGateInputEnvelope
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
  }

  export type DeviceRegistryCreateNestedManyWithoutGateInput = {
    create?: XOR<DeviceRegistryCreateWithoutGateInput, DeviceRegistryUncheckedCreateWithoutGateInput> | DeviceRegistryCreateWithoutGateInput[] | DeviceRegistryUncheckedCreateWithoutGateInput[]
    connectOrCreate?: DeviceRegistryCreateOrConnectWithoutGateInput | DeviceRegistryCreateOrConnectWithoutGateInput[]
    createMany?: DeviceRegistryCreateManyGateInputEnvelope
    connect?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
  }

  export type AccessEventUncheckedCreateNestedManyWithoutGateInput = {
    create?: XOR<AccessEventCreateWithoutGateInput, AccessEventUncheckedCreateWithoutGateInput> | AccessEventCreateWithoutGateInput[] | AccessEventUncheckedCreateWithoutGateInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutGateInput | AccessEventCreateOrConnectWithoutGateInput[]
    createMany?: AccessEventCreateManyGateInputEnvelope
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
  }

  export type DeviceRegistryUncheckedCreateNestedManyWithoutGateInput = {
    create?: XOR<DeviceRegistryCreateWithoutGateInput, DeviceRegistryUncheckedCreateWithoutGateInput> | DeviceRegistryCreateWithoutGateInput[] | DeviceRegistryUncheckedCreateWithoutGateInput[]
    connectOrCreate?: DeviceRegistryCreateOrConnectWithoutGateInput | DeviceRegistryCreateOrConnectWithoutGateInput[]
    createMany?: DeviceRegistryCreateManyGateInputEnvelope
    connect?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
  }

  export type EnumGateDirectionFieldUpdateOperationsInput = {
    set?: $Enums.GateDirection
  }

  export type EnumGateStatusFieldUpdateOperationsInput = {
    set?: $Enums.GateStatus
  }

  export type BranchUpdateOneRequiredWithoutGatesNestedInput = {
    create?: XOR<BranchCreateWithoutGatesInput, BranchUncheckedCreateWithoutGatesInput>
    connectOrCreate?: BranchCreateOrConnectWithoutGatesInput
    upsert?: BranchUpsertWithoutGatesInput
    connect?: BranchWhereUniqueInput
    update?: XOR<XOR<BranchUpdateToOneWithWhereWithoutGatesInput, BranchUpdateWithoutGatesInput>, BranchUncheckedUpdateWithoutGatesInput>
  }

  export type AccessEventUpdateManyWithoutGateNestedInput = {
    create?: XOR<AccessEventCreateWithoutGateInput, AccessEventUncheckedCreateWithoutGateInput> | AccessEventCreateWithoutGateInput[] | AccessEventUncheckedCreateWithoutGateInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutGateInput | AccessEventCreateOrConnectWithoutGateInput[]
    upsert?: AccessEventUpsertWithWhereUniqueWithoutGateInput | AccessEventUpsertWithWhereUniqueWithoutGateInput[]
    createMany?: AccessEventCreateManyGateInputEnvelope
    set?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    disconnect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    delete?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    update?: AccessEventUpdateWithWhereUniqueWithoutGateInput | AccessEventUpdateWithWhereUniqueWithoutGateInput[]
    updateMany?: AccessEventUpdateManyWithWhereWithoutGateInput | AccessEventUpdateManyWithWhereWithoutGateInput[]
    deleteMany?: AccessEventScalarWhereInput | AccessEventScalarWhereInput[]
  }

  export type DeviceRegistryUpdateManyWithoutGateNestedInput = {
    create?: XOR<DeviceRegistryCreateWithoutGateInput, DeviceRegistryUncheckedCreateWithoutGateInput> | DeviceRegistryCreateWithoutGateInput[] | DeviceRegistryUncheckedCreateWithoutGateInput[]
    connectOrCreate?: DeviceRegistryCreateOrConnectWithoutGateInput | DeviceRegistryCreateOrConnectWithoutGateInput[]
    upsert?: DeviceRegistryUpsertWithWhereUniqueWithoutGateInput | DeviceRegistryUpsertWithWhereUniqueWithoutGateInput[]
    createMany?: DeviceRegistryCreateManyGateInputEnvelope
    set?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    disconnect?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    delete?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    connect?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    update?: DeviceRegistryUpdateWithWhereUniqueWithoutGateInput | DeviceRegistryUpdateWithWhereUniqueWithoutGateInput[]
    updateMany?: DeviceRegistryUpdateManyWithWhereWithoutGateInput | DeviceRegistryUpdateManyWithWhereWithoutGateInput[]
    deleteMany?: DeviceRegistryScalarWhereInput | DeviceRegistryScalarWhereInput[]
  }

  export type AccessEventUncheckedUpdateManyWithoutGateNestedInput = {
    create?: XOR<AccessEventCreateWithoutGateInput, AccessEventUncheckedCreateWithoutGateInput> | AccessEventCreateWithoutGateInput[] | AccessEventUncheckedCreateWithoutGateInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutGateInput | AccessEventCreateOrConnectWithoutGateInput[]
    upsert?: AccessEventUpsertWithWhereUniqueWithoutGateInput | AccessEventUpsertWithWhereUniqueWithoutGateInput[]
    createMany?: AccessEventCreateManyGateInputEnvelope
    set?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    disconnect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    delete?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    update?: AccessEventUpdateWithWhereUniqueWithoutGateInput | AccessEventUpdateWithWhereUniqueWithoutGateInput[]
    updateMany?: AccessEventUpdateManyWithWhereWithoutGateInput | AccessEventUpdateManyWithWhereWithoutGateInput[]
    deleteMany?: AccessEventScalarWhereInput | AccessEventScalarWhereInput[]
  }

  export type DeviceRegistryUncheckedUpdateManyWithoutGateNestedInput = {
    create?: XOR<DeviceRegistryCreateWithoutGateInput, DeviceRegistryUncheckedCreateWithoutGateInput> | DeviceRegistryCreateWithoutGateInput[] | DeviceRegistryUncheckedCreateWithoutGateInput[]
    connectOrCreate?: DeviceRegistryCreateOrConnectWithoutGateInput | DeviceRegistryCreateOrConnectWithoutGateInput[]
    upsert?: DeviceRegistryUpsertWithWhereUniqueWithoutGateInput | DeviceRegistryUpsertWithWhereUniqueWithoutGateInput[]
    createMany?: DeviceRegistryCreateManyGateInputEnvelope
    set?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    disconnect?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    delete?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    connect?: DeviceRegistryWhereUniqueInput | DeviceRegistryWhereUniqueInput[]
    update?: DeviceRegistryUpdateWithWhereUniqueWithoutGateInput | DeviceRegistryUpdateWithWhereUniqueWithoutGateInput[]
    updateMany?: DeviceRegistryUpdateManyWithWhereWithoutGateInput | DeviceRegistryUpdateManyWithWhereWithoutGateInput[]
    deleteMany?: DeviceRegistryScalarWhereInput | DeviceRegistryScalarWhereInput[]
  }

  export type QrTokenCreateNestedManyWithoutMemberInput = {
    create?: XOR<QrTokenCreateWithoutMemberInput, QrTokenUncheckedCreateWithoutMemberInput> | QrTokenCreateWithoutMemberInput[] | QrTokenUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: QrTokenCreateOrConnectWithoutMemberInput | QrTokenCreateOrConnectWithoutMemberInput[]
    createMany?: QrTokenCreateManyMemberInputEnvelope
    connect?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
  }

  export type AccessEventCreateNestedManyWithoutMemberInput = {
    create?: XOR<AccessEventCreateWithoutMemberInput, AccessEventUncheckedCreateWithoutMemberInput> | AccessEventCreateWithoutMemberInput[] | AccessEventUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutMemberInput | AccessEventCreateOrConnectWithoutMemberInput[]
    createMany?: AccessEventCreateManyMemberInputEnvelope
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
  }

  export type IdCardSessionCreateNestedManyWithoutMemberInput = {
    create?: XOR<IdCardSessionCreateWithoutMemberInput, IdCardSessionUncheckedCreateWithoutMemberInput> | IdCardSessionCreateWithoutMemberInput[] | IdCardSessionUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutMemberInput | IdCardSessionCreateOrConnectWithoutMemberInput[]
    createMany?: IdCardSessionCreateManyMemberInputEnvelope
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
  }

  export type QrTokenUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<QrTokenCreateWithoutMemberInput, QrTokenUncheckedCreateWithoutMemberInput> | QrTokenCreateWithoutMemberInput[] | QrTokenUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: QrTokenCreateOrConnectWithoutMemberInput | QrTokenCreateOrConnectWithoutMemberInput[]
    createMany?: QrTokenCreateManyMemberInputEnvelope
    connect?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
  }

  export type AccessEventUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<AccessEventCreateWithoutMemberInput, AccessEventUncheckedCreateWithoutMemberInput> | AccessEventCreateWithoutMemberInput[] | AccessEventUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutMemberInput | AccessEventCreateOrConnectWithoutMemberInput[]
    createMany?: AccessEventCreateManyMemberInputEnvelope
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
  }

  export type IdCardSessionUncheckedCreateNestedManyWithoutMemberInput = {
    create?: XOR<IdCardSessionCreateWithoutMemberInput, IdCardSessionUncheckedCreateWithoutMemberInput> | IdCardSessionCreateWithoutMemberInput[] | IdCardSessionUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutMemberInput | IdCardSessionCreateOrConnectWithoutMemberInput[]
    createMany?: IdCardSessionCreateManyMemberInputEnvelope
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
  }

  export type EnumMemberTypeFieldUpdateOperationsInput = {
    set?: $Enums.MemberType
  }

  export type EnumMemberStatusFieldUpdateOperationsInput = {
    set?: $Enums.MemberStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableBytesFieldUpdateOperationsInput = {
    set?: Bytes | null
  }

  export type QrTokenUpdateManyWithoutMemberNestedInput = {
    create?: XOR<QrTokenCreateWithoutMemberInput, QrTokenUncheckedCreateWithoutMemberInput> | QrTokenCreateWithoutMemberInput[] | QrTokenUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: QrTokenCreateOrConnectWithoutMemberInput | QrTokenCreateOrConnectWithoutMemberInput[]
    upsert?: QrTokenUpsertWithWhereUniqueWithoutMemberInput | QrTokenUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: QrTokenCreateManyMemberInputEnvelope
    set?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    disconnect?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    delete?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    connect?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    update?: QrTokenUpdateWithWhereUniqueWithoutMemberInput | QrTokenUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: QrTokenUpdateManyWithWhereWithoutMemberInput | QrTokenUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: QrTokenScalarWhereInput | QrTokenScalarWhereInput[]
  }

  export type AccessEventUpdateManyWithoutMemberNestedInput = {
    create?: XOR<AccessEventCreateWithoutMemberInput, AccessEventUncheckedCreateWithoutMemberInput> | AccessEventCreateWithoutMemberInput[] | AccessEventUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutMemberInput | AccessEventCreateOrConnectWithoutMemberInput[]
    upsert?: AccessEventUpsertWithWhereUniqueWithoutMemberInput | AccessEventUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: AccessEventCreateManyMemberInputEnvelope
    set?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    disconnect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    delete?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    update?: AccessEventUpdateWithWhereUniqueWithoutMemberInput | AccessEventUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: AccessEventUpdateManyWithWhereWithoutMemberInput | AccessEventUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: AccessEventScalarWhereInput | AccessEventScalarWhereInput[]
  }

  export type IdCardSessionUpdateManyWithoutMemberNestedInput = {
    create?: XOR<IdCardSessionCreateWithoutMemberInput, IdCardSessionUncheckedCreateWithoutMemberInput> | IdCardSessionCreateWithoutMemberInput[] | IdCardSessionUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutMemberInput | IdCardSessionCreateOrConnectWithoutMemberInput[]
    upsert?: IdCardSessionUpsertWithWhereUniqueWithoutMemberInput | IdCardSessionUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: IdCardSessionCreateManyMemberInputEnvelope
    set?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    disconnect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    delete?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    update?: IdCardSessionUpdateWithWhereUniqueWithoutMemberInput | IdCardSessionUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: IdCardSessionUpdateManyWithWhereWithoutMemberInput | IdCardSessionUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: IdCardSessionScalarWhereInput | IdCardSessionScalarWhereInput[]
  }

  export type QrTokenUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<QrTokenCreateWithoutMemberInput, QrTokenUncheckedCreateWithoutMemberInput> | QrTokenCreateWithoutMemberInput[] | QrTokenUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: QrTokenCreateOrConnectWithoutMemberInput | QrTokenCreateOrConnectWithoutMemberInput[]
    upsert?: QrTokenUpsertWithWhereUniqueWithoutMemberInput | QrTokenUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: QrTokenCreateManyMemberInputEnvelope
    set?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    disconnect?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    delete?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    connect?: QrTokenWhereUniqueInput | QrTokenWhereUniqueInput[]
    update?: QrTokenUpdateWithWhereUniqueWithoutMemberInput | QrTokenUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: QrTokenUpdateManyWithWhereWithoutMemberInput | QrTokenUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: QrTokenScalarWhereInput | QrTokenScalarWhereInput[]
  }

  export type AccessEventUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<AccessEventCreateWithoutMemberInput, AccessEventUncheckedCreateWithoutMemberInput> | AccessEventCreateWithoutMemberInput[] | AccessEventUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: AccessEventCreateOrConnectWithoutMemberInput | AccessEventCreateOrConnectWithoutMemberInput[]
    upsert?: AccessEventUpsertWithWhereUniqueWithoutMemberInput | AccessEventUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: AccessEventCreateManyMemberInputEnvelope
    set?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    disconnect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    delete?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    connect?: AccessEventWhereUniqueInput | AccessEventWhereUniqueInput[]
    update?: AccessEventUpdateWithWhereUniqueWithoutMemberInput | AccessEventUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: AccessEventUpdateManyWithWhereWithoutMemberInput | AccessEventUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: AccessEventScalarWhereInput | AccessEventScalarWhereInput[]
  }

  export type IdCardSessionUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: XOR<IdCardSessionCreateWithoutMemberInput, IdCardSessionUncheckedCreateWithoutMemberInput> | IdCardSessionCreateWithoutMemberInput[] | IdCardSessionUncheckedCreateWithoutMemberInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutMemberInput | IdCardSessionCreateOrConnectWithoutMemberInput[]
    upsert?: IdCardSessionUpsertWithWhereUniqueWithoutMemberInput | IdCardSessionUpsertWithWhereUniqueWithoutMemberInput[]
    createMany?: IdCardSessionCreateManyMemberInputEnvelope
    set?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    disconnect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    delete?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    update?: IdCardSessionUpdateWithWhereUniqueWithoutMemberInput | IdCardSessionUpdateWithWhereUniqueWithoutMemberInput[]
    updateMany?: IdCardSessionUpdateManyWithWhereWithoutMemberInput | IdCardSessionUpdateManyWithWhereWithoutMemberInput[]
    deleteMany?: IdCardSessionScalarWhereInput | IdCardSessionScalarWhereInput[]
  }

  export type MemberCreateNestedOneWithoutQrTokensInput = {
    create?: XOR<MemberCreateWithoutQrTokensInput, MemberUncheckedCreateWithoutQrTokensInput>
    connectOrCreate?: MemberCreateOrConnectWithoutQrTokensInput
    connect?: MemberWhereUniqueInput
  }

  export type AccessEventCreateNestedOneWithoutQrTokenInput = {
    create?: XOR<AccessEventCreateWithoutQrTokenInput, AccessEventUncheckedCreateWithoutQrTokenInput>
    connectOrCreate?: AccessEventCreateOrConnectWithoutQrTokenInput
    connect?: AccessEventWhereUniqueInput
  }

  export type AccessEventUncheckedCreateNestedOneWithoutQrTokenInput = {
    create?: XOR<AccessEventCreateWithoutQrTokenInput, AccessEventUncheckedCreateWithoutQrTokenInput>
    connectOrCreate?: AccessEventCreateOrConnectWithoutQrTokenInput
    connect?: AccessEventWhereUniqueInput
  }

  export type EnumQrPurposeFieldUpdateOperationsInput = {
    set?: $Enums.QrPurpose
  }

  export type MemberUpdateOneRequiredWithoutQrTokensNestedInput = {
    create?: XOR<MemberCreateWithoutQrTokensInput, MemberUncheckedCreateWithoutQrTokensInput>
    connectOrCreate?: MemberCreateOrConnectWithoutQrTokensInput
    upsert?: MemberUpsertWithoutQrTokensInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutQrTokensInput, MemberUpdateWithoutQrTokensInput>, MemberUncheckedUpdateWithoutQrTokensInput>
  }

  export type AccessEventUpdateOneWithoutQrTokenNestedInput = {
    create?: XOR<AccessEventCreateWithoutQrTokenInput, AccessEventUncheckedCreateWithoutQrTokenInput>
    connectOrCreate?: AccessEventCreateOrConnectWithoutQrTokenInput
    upsert?: AccessEventUpsertWithoutQrTokenInput
    disconnect?: AccessEventWhereInput | boolean
    delete?: AccessEventWhereInput | boolean
    connect?: AccessEventWhereUniqueInput
    update?: XOR<XOR<AccessEventUpdateToOneWithWhereWithoutQrTokenInput, AccessEventUpdateWithoutQrTokenInput>, AccessEventUncheckedUpdateWithoutQrTokenInput>
  }

  export type AccessEventUncheckedUpdateOneWithoutQrTokenNestedInput = {
    create?: XOR<AccessEventCreateWithoutQrTokenInput, AccessEventUncheckedCreateWithoutQrTokenInput>
    connectOrCreate?: AccessEventCreateOrConnectWithoutQrTokenInput
    upsert?: AccessEventUpsertWithoutQrTokenInput
    disconnect?: AccessEventWhereInput | boolean
    delete?: AccessEventWhereInput | boolean
    connect?: AccessEventWhereUniqueInput
    update?: XOR<XOR<AccessEventUpdateToOneWithWhereWithoutQrTokenInput, AccessEventUpdateWithoutQrTokenInput>, AccessEventUncheckedUpdateWithoutQrTokenInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type GateCreateNestedOneWithoutAccessEventsInput = {
    create?: XOR<GateCreateWithoutAccessEventsInput, GateUncheckedCreateWithoutAccessEventsInput>
    connectOrCreate?: GateCreateOrConnectWithoutAccessEventsInput
    connect?: GateWhereUniqueInput
  }

  export type MemberCreateNestedOneWithoutAccessEventsInput = {
    create?: XOR<MemberCreateWithoutAccessEventsInput, MemberUncheckedCreateWithoutAccessEventsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutAccessEventsInput
    connect?: MemberWhereUniqueInput
  }

  export type QrTokenCreateNestedOneWithoutAccessEventInput = {
    create?: XOR<QrTokenCreateWithoutAccessEventInput, QrTokenUncheckedCreateWithoutAccessEventInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutAccessEventInput
    connect?: QrTokenWhereUniqueInput
  }

  export type EnumAccessSourceFieldUpdateOperationsInput = {
    set?: $Enums.AccessSource
  }

  export type EnumAccessDecisionFieldUpdateOperationsInput = {
    set?: $Enums.AccessDecision
  }

  export type GateUpdateOneRequiredWithoutAccessEventsNestedInput = {
    create?: XOR<GateCreateWithoutAccessEventsInput, GateUncheckedCreateWithoutAccessEventsInput>
    connectOrCreate?: GateCreateOrConnectWithoutAccessEventsInput
    upsert?: GateUpsertWithoutAccessEventsInput
    connect?: GateWhereUniqueInput
    update?: XOR<XOR<GateUpdateToOneWithWhereWithoutAccessEventsInput, GateUpdateWithoutAccessEventsInput>, GateUncheckedUpdateWithoutAccessEventsInput>
  }

  export type MemberUpdateOneRequiredWithoutAccessEventsNestedInput = {
    create?: XOR<MemberCreateWithoutAccessEventsInput, MemberUncheckedCreateWithoutAccessEventsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutAccessEventsInput
    upsert?: MemberUpsertWithoutAccessEventsInput
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutAccessEventsInput, MemberUpdateWithoutAccessEventsInput>, MemberUncheckedUpdateWithoutAccessEventsInput>
  }

  export type QrTokenUpdateOneWithoutAccessEventNestedInput = {
    create?: XOR<QrTokenCreateWithoutAccessEventInput, QrTokenUncheckedCreateWithoutAccessEventInput>
    connectOrCreate?: QrTokenCreateOrConnectWithoutAccessEventInput
    upsert?: QrTokenUpsertWithoutAccessEventInput
    disconnect?: QrTokenWhereInput | boolean
    delete?: QrTokenWhereInput | boolean
    connect?: QrTokenWhereUniqueInput
    update?: XOR<XOR<QrTokenUpdateToOneWithWhereWithoutAccessEventInput, QrTokenUpdateWithoutAccessEventInput>, QrTokenUncheckedUpdateWithoutAccessEventInput>
  }

  export type GateCreateNestedOneWithoutDevicesInput = {
    create?: XOR<GateCreateWithoutDevicesInput, GateUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: GateCreateOrConnectWithoutDevicesInput
    connect?: GateWhereUniqueInput
  }

  export type IdCardSessionCreateNestedManyWithoutDeviceInput = {
    create?: XOR<IdCardSessionCreateWithoutDeviceInput, IdCardSessionUncheckedCreateWithoutDeviceInput> | IdCardSessionCreateWithoutDeviceInput[] | IdCardSessionUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutDeviceInput | IdCardSessionCreateOrConnectWithoutDeviceInput[]
    createMany?: IdCardSessionCreateManyDeviceInputEnvelope
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
  }

  export type IdCardSessionUncheckedCreateNestedManyWithoutDeviceInput = {
    create?: XOR<IdCardSessionCreateWithoutDeviceInput, IdCardSessionUncheckedCreateWithoutDeviceInput> | IdCardSessionCreateWithoutDeviceInput[] | IdCardSessionUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutDeviceInput | IdCardSessionCreateOrConnectWithoutDeviceInput[]
    createMany?: IdCardSessionCreateManyDeviceInputEnvelope
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
  }

  export type EnumDeviceTypeFieldUpdateOperationsInput = {
    set?: $Enums.DeviceType
  }

  export type EnumDeviceStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeviceStatus
  }

  export type GateUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<GateCreateWithoutDevicesInput, GateUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: GateCreateOrConnectWithoutDevicesInput
    upsert?: GateUpsertWithoutDevicesInput
    connect?: GateWhereUniqueInput
    update?: XOR<XOR<GateUpdateToOneWithWhereWithoutDevicesInput, GateUpdateWithoutDevicesInput>, GateUncheckedUpdateWithoutDevicesInput>
  }

  export type IdCardSessionUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<IdCardSessionCreateWithoutDeviceInput, IdCardSessionUncheckedCreateWithoutDeviceInput> | IdCardSessionCreateWithoutDeviceInput[] | IdCardSessionUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutDeviceInput | IdCardSessionCreateOrConnectWithoutDeviceInput[]
    upsert?: IdCardSessionUpsertWithWhereUniqueWithoutDeviceInput | IdCardSessionUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: IdCardSessionCreateManyDeviceInputEnvelope
    set?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    disconnect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    delete?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    update?: IdCardSessionUpdateWithWhereUniqueWithoutDeviceInput | IdCardSessionUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: IdCardSessionUpdateManyWithWhereWithoutDeviceInput | IdCardSessionUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: IdCardSessionScalarWhereInput | IdCardSessionScalarWhereInput[]
  }

  export type IdCardSessionUncheckedUpdateManyWithoutDeviceNestedInput = {
    create?: XOR<IdCardSessionCreateWithoutDeviceInput, IdCardSessionUncheckedCreateWithoutDeviceInput> | IdCardSessionCreateWithoutDeviceInput[] | IdCardSessionUncheckedCreateWithoutDeviceInput[]
    connectOrCreate?: IdCardSessionCreateOrConnectWithoutDeviceInput | IdCardSessionCreateOrConnectWithoutDeviceInput[]
    upsert?: IdCardSessionUpsertWithWhereUniqueWithoutDeviceInput | IdCardSessionUpsertWithWhereUniqueWithoutDeviceInput[]
    createMany?: IdCardSessionCreateManyDeviceInputEnvelope
    set?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    disconnect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    delete?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    connect?: IdCardSessionWhereUniqueInput | IdCardSessionWhereUniqueInput[]
    update?: IdCardSessionUpdateWithWhereUniqueWithoutDeviceInput | IdCardSessionUpdateWithWhereUniqueWithoutDeviceInput[]
    updateMany?: IdCardSessionUpdateManyWithWhereWithoutDeviceInput | IdCardSessionUpdateManyWithWhereWithoutDeviceInput[]
    deleteMany?: IdCardSessionScalarWhereInput | IdCardSessionScalarWhereInput[]
  }

  export type MemberCreateNestedOneWithoutIdCardSessionsInput = {
    create?: XOR<MemberCreateWithoutIdCardSessionsInput, MemberUncheckedCreateWithoutIdCardSessionsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutIdCardSessionsInput
    connect?: MemberWhereUniqueInput
  }

  export type DeviceRegistryCreateNestedOneWithoutIdCardSessionsInput = {
    create?: XOR<DeviceRegistryCreateWithoutIdCardSessionsInput, DeviceRegistryUncheckedCreateWithoutIdCardSessionsInput>
    connectOrCreate?: DeviceRegistryCreateOrConnectWithoutIdCardSessionsInput
    connect?: DeviceRegistryWhereUniqueInput
  }

  export type EnumIdCardReadStatusFieldUpdateOperationsInput = {
    set?: $Enums.IdCardReadStatus
  }

  export type MemberUpdateOneWithoutIdCardSessionsNestedInput = {
    create?: XOR<MemberCreateWithoutIdCardSessionsInput, MemberUncheckedCreateWithoutIdCardSessionsInput>
    connectOrCreate?: MemberCreateOrConnectWithoutIdCardSessionsInput
    upsert?: MemberUpsertWithoutIdCardSessionsInput
    disconnect?: MemberWhereInput | boolean
    delete?: MemberWhereInput | boolean
    connect?: MemberWhereUniqueInput
    update?: XOR<XOR<MemberUpdateToOneWithWhereWithoutIdCardSessionsInput, MemberUpdateWithoutIdCardSessionsInput>, MemberUncheckedUpdateWithoutIdCardSessionsInput>
  }

  export type DeviceRegistryUpdateOneWithoutIdCardSessionsNestedInput = {
    create?: XOR<DeviceRegistryCreateWithoutIdCardSessionsInput, DeviceRegistryUncheckedCreateWithoutIdCardSessionsInput>
    connectOrCreate?: DeviceRegistryCreateOrConnectWithoutIdCardSessionsInput
    upsert?: DeviceRegistryUpsertWithoutIdCardSessionsInput
    disconnect?: DeviceRegistryWhereInput | boolean
    delete?: DeviceRegistryWhereInput | boolean
    connect?: DeviceRegistryWhereUniqueInput
    update?: XOR<XOR<DeviceRegistryUpdateToOneWithWhereWithoutIdCardSessionsInput, DeviceRegistryUpdateWithoutIdCardSessionsInput>, DeviceRegistryUncheckedUpdateWithoutIdCardSessionsInput>
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumGateDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.GateDirection | EnumGateDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.GateDirection[]
    notIn?: $Enums.GateDirection[]
    not?: NestedEnumGateDirectionFilter<$PrismaModel> | $Enums.GateDirection
  }

  export type NestedEnumGateStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GateStatus | EnumGateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GateStatus[]
    notIn?: $Enums.GateStatus[]
    not?: NestedEnumGateStatusFilter<$PrismaModel> | $Enums.GateStatus
  }

  export type NestedEnumGateDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GateDirection | EnumGateDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.GateDirection[]
    notIn?: $Enums.GateDirection[]
    not?: NestedEnumGateDirectionWithAggregatesFilter<$PrismaModel> | $Enums.GateDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGateDirectionFilter<$PrismaModel>
    _max?: NestedEnumGateDirectionFilter<$PrismaModel>
  }

  export type NestedEnumGateStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GateStatus | EnumGateStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GateStatus[]
    notIn?: $Enums.GateStatus[]
    not?: NestedEnumGateStatusWithAggregatesFilter<$PrismaModel> | $Enums.GateStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGateStatusFilter<$PrismaModel>
    _max?: NestedEnumGateStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumMemberTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberType | EnumMemberTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MemberType[]
    notIn?: $Enums.MemberType[]
    not?: NestedEnumMemberTypeFilter<$PrismaModel> | $Enums.MemberType
  }

  export type NestedEnumMemberStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberStatus | EnumMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MemberStatus[]
    notIn?: $Enums.MemberStatus[]
    not?: NestedEnumMemberStatusFilter<$PrismaModel> | $Enums.MemberStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBytesNullableFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | null
    notIn?: Bytes[] | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Bytes | null
  }

  export type NestedEnumMemberTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberType | EnumMemberTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MemberType[]
    notIn?: $Enums.MemberType[]
    not?: NestedEnumMemberTypeWithAggregatesFilter<$PrismaModel> | $Enums.MemberType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberTypeFilter<$PrismaModel>
    _max?: NestedEnumMemberTypeFilter<$PrismaModel>
  }

  export type NestedEnumMemberStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberStatus | EnumMemberStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MemberStatus[]
    notIn?: $Enums.MemberStatus[]
    not?: NestedEnumMemberStatusWithAggregatesFilter<$PrismaModel> | $Enums.MemberStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberStatusFilter<$PrismaModel>
    _max?: NestedEnumMemberStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel> | null
    in?: Bytes[] | null
    notIn?: Bytes[] | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Bytes | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
  }

  export type NestedEnumQrPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.QrPurpose | EnumQrPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.QrPurpose[]
    notIn?: $Enums.QrPurpose[]
    not?: NestedEnumQrPurposeFilter<$PrismaModel> | $Enums.QrPurpose
  }

  export type NestedEnumQrPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QrPurpose | EnumQrPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.QrPurpose[]
    notIn?: $Enums.QrPurpose[]
    not?: NestedEnumQrPurposeWithAggregatesFilter<$PrismaModel> | $Enums.QrPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQrPurposeFilter<$PrismaModel>
    _max?: NestedEnumQrPurposeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumAccessSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessSource | EnumAccessSourceFieldRefInput<$PrismaModel>
    in?: $Enums.AccessSource[]
    notIn?: $Enums.AccessSource[]
    not?: NestedEnumAccessSourceFilter<$PrismaModel> | $Enums.AccessSource
  }

  export type NestedEnumAccessDecisionFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessDecision | EnumAccessDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.AccessDecision[]
    notIn?: $Enums.AccessDecision[]
    not?: NestedEnumAccessDecisionFilter<$PrismaModel> | $Enums.AccessDecision
  }

  export type NestedEnumAccessSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessSource | EnumAccessSourceFieldRefInput<$PrismaModel>
    in?: $Enums.AccessSource[]
    notIn?: $Enums.AccessSource[]
    not?: NestedEnumAccessSourceWithAggregatesFilter<$PrismaModel> | $Enums.AccessSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessSourceFilter<$PrismaModel>
    _max?: NestedEnumAccessSourceFilter<$PrismaModel>
  }

  export type NestedEnumAccessDecisionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccessDecision | EnumAccessDecisionFieldRefInput<$PrismaModel>
    in?: $Enums.AccessDecision[]
    notIn?: $Enums.AccessDecision[]
    not?: NestedEnumAccessDecisionWithAggregatesFilter<$PrismaModel> | $Enums.AccessDecision
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccessDecisionFilter<$PrismaModel>
    _max?: NestedEnumAccessDecisionFilter<$PrismaModel>
  }

  export type NestedEnumDeviceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeFilter<$PrismaModel> | $Enums.DeviceType
  }

  export type NestedEnumDeviceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[]
    notIn?: $Enums.DeviceStatus[]
    not?: NestedEnumDeviceStatusFilter<$PrismaModel> | $Enums.DeviceStatus
  }

  export type NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceType | EnumDeviceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceType[]
    notIn?: $Enums.DeviceType[]
    not?: NestedEnumDeviceTypeWithAggregatesFilter<$PrismaModel> | $Enums.DeviceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceTypeFilter<$PrismaModel>
    _max?: NestedEnumDeviceTypeFilter<$PrismaModel>
  }

  export type NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeviceStatus | EnumDeviceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeviceStatus[]
    notIn?: $Enums.DeviceStatus[]
    not?: NestedEnumDeviceStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeviceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeviceStatusFilter<$PrismaModel>
    _max?: NestedEnumDeviceStatusFilter<$PrismaModel>
  }

  export type NestedEnumIdCardReadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IdCardReadStatus | EnumIdCardReadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IdCardReadStatus[]
    notIn?: $Enums.IdCardReadStatus[]
    not?: NestedEnumIdCardReadStatusFilter<$PrismaModel> | $Enums.IdCardReadStatus
  }

  export type NestedEnumIdCardReadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IdCardReadStatus | EnumIdCardReadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IdCardReadStatus[]
    notIn?: $Enums.IdCardReadStatus[]
    not?: NestedEnumIdCardReadStatusWithAggregatesFilter<$PrismaModel> | $Enums.IdCardReadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIdCardReadStatusFilter<$PrismaModel>
    _max?: NestedEnumIdCardReadStatusFilter<$PrismaModel>
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: string
    resource: string
    resourceId?: string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    resource: string
    resourceId?: string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    resource?: StringFilter<"AuditLog"> | string
    resourceId?: StringNullableFilter<"AuditLog"> | string | null
    dataBefore?: JsonNullableFilter<"AuditLog">
    dataAfter?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type GateCreateWithoutBranchInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    accessEvents?: AccessEventCreateNestedManyWithoutGateInput
    devices?: DeviceRegistryCreateNestedManyWithoutGateInput
  }

  export type GateUncheckedCreateWithoutBranchInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    accessEvents?: AccessEventUncheckedCreateNestedManyWithoutGateInput
    devices?: DeviceRegistryUncheckedCreateNestedManyWithoutGateInput
  }

  export type GateCreateOrConnectWithoutBranchInput = {
    where: GateWhereUniqueInput
    create: XOR<GateCreateWithoutBranchInput, GateUncheckedCreateWithoutBranchInput>
  }

  export type GateCreateManyBranchInputEnvelope = {
    data: GateCreateManyBranchInput | GateCreateManyBranchInput[]
  }

  export type GateUpsertWithWhereUniqueWithoutBranchInput = {
    where: GateWhereUniqueInput
    update: XOR<GateUpdateWithoutBranchInput, GateUncheckedUpdateWithoutBranchInput>
    create: XOR<GateCreateWithoutBranchInput, GateUncheckedCreateWithoutBranchInput>
  }

  export type GateUpdateWithWhereUniqueWithoutBranchInput = {
    where: GateWhereUniqueInput
    data: XOR<GateUpdateWithoutBranchInput, GateUncheckedUpdateWithoutBranchInput>
  }

  export type GateUpdateManyWithWhereWithoutBranchInput = {
    where: GateScalarWhereInput
    data: XOR<GateUpdateManyMutationInput, GateUncheckedUpdateManyWithoutBranchInput>
  }

  export type GateScalarWhereInput = {
    AND?: GateScalarWhereInput | GateScalarWhereInput[]
    OR?: GateScalarWhereInput[]
    NOT?: GateScalarWhereInput | GateScalarWhereInput[]
    id?: StringFilter<"Gate"> | string
    gateCode?: StringFilter<"Gate"> | string
    nameTh?: StringFilter<"Gate"> | string
    nameEn?: StringFilter<"Gate"> | string
    nameZh?: StringFilter<"Gate"> | string
    branchId?: StringFilter<"Gate"> | string
    direction?: EnumGateDirectionFilter<"Gate"> | $Enums.GateDirection
    status?: EnumGateStatusFilter<"Gate"> | $Enums.GateStatus
    metadata?: JsonNullableFilter<"Gate">
    createdAt?: DateTimeFilter<"Gate"> | Date | string
    updatedAt?: DateTimeFilter<"Gate"> | Date | string
  }

  export type BranchCreateWithoutGatesInput = {
    id?: string
    code: string
    nameTh: string
    nameEn: string
    nameZh: string
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type BranchUncheckedCreateWithoutGatesInput = {
    id?: string
    code: string
    nameTh: string
    nameEn: string
    nameZh: string
    address?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type BranchCreateOrConnectWithoutGatesInput = {
    where: BranchWhereUniqueInput
    create: XOR<BranchCreateWithoutGatesInput, BranchUncheckedCreateWithoutGatesInput>
  }

  export type AccessEventCreateWithoutGateInput = {
    id?: string
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
    member: MemberCreateNestedOneWithoutAccessEventsInput
    qrToken?: QrTokenCreateNestedOneWithoutAccessEventInput
  }

  export type AccessEventUncheckedCreateWithoutGateInput = {
    id?: string
    memberId: string
    qrTokenId?: string | null
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type AccessEventCreateOrConnectWithoutGateInput = {
    where: AccessEventWhereUniqueInput
    create: XOR<AccessEventCreateWithoutGateInput, AccessEventUncheckedCreateWithoutGateInput>
  }

  export type AccessEventCreateManyGateInputEnvelope = {
    data: AccessEventCreateManyGateInput | AccessEventCreateManyGateInput[]
  }

  export type DeviceRegistryCreateWithoutGateInput = {
    id?: string
    deviceCode: string
    name: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    idCardSessions?: IdCardSessionCreateNestedManyWithoutDeviceInput
  }

  export type DeviceRegistryUncheckedCreateWithoutGateInput = {
    id?: string
    deviceCode: string
    name: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    idCardSessions?: IdCardSessionUncheckedCreateNestedManyWithoutDeviceInput
  }

  export type DeviceRegistryCreateOrConnectWithoutGateInput = {
    where: DeviceRegistryWhereUniqueInput
    create: XOR<DeviceRegistryCreateWithoutGateInput, DeviceRegistryUncheckedCreateWithoutGateInput>
  }

  export type DeviceRegistryCreateManyGateInputEnvelope = {
    data: DeviceRegistryCreateManyGateInput | DeviceRegistryCreateManyGateInput[]
  }

  export type BranchUpsertWithoutGatesInput = {
    update: XOR<BranchUpdateWithoutGatesInput, BranchUncheckedUpdateWithoutGatesInput>
    create: XOR<BranchCreateWithoutGatesInput, BranchUncheckedCreateWithoutGatesInput>
    where?: BranchWhereInput
  }

  export type BranchUpdateToOneWithWhereWithoutGatesInput = {
    where?: BranchWhereInput
    data: XOR<BranchUpdateWithoutGatesInput, BranchUncheckedUpdateWithoutGatesInput>
  }

  export type BranchUpdateWithoutGatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BranchUncheckedUpdateWithoutGatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventUpsertWithWhereUniqueWithoutGateInput = {
    where: AccessEventWhereUniqueInput
    update: XOR<AccessEventUpdateWithoutGateInput, AccessEventUncheckedUpdateWithoutGateInput>
    create: XOR<AccessEventCreateWithoutGateInput, AccessEventUncheckedCreateWithoutGateInput>
  }

  export type AccessEventUpdateWithWhereUniqueWithoutGateInput = {
    where: AccessEventWhereUniqueInput
    data: XOR<AccessEventUpdateWithoutGateInput, AccessEventUncheckedUpdateWithoutGateInput>
  }

  export type AccessEventUpdateManyWithWhereWithoutGateInput = {
    where: AccessEventScalarWhereInput
    data: XOR<AccessEventUpdateManyMutationInput, AccessEventUncheckedUpdateManyWithoutGateInput>
  }

  export type AccessEventScalarWhereInput = {
    AND?: AccessEventScalarWhereInput | AccessEventScalarWhereInput[]
    OR?: AccessEventScalarWhereInput[]
    NOT?: AccessEventScalarWhereInput | AccessEventScalarWhereInput[]
    id?: StringFilter<"AccessEvent"> | string
    gateId?: StringFilter<"AccessEvent"> | string
    memberId?: StringFilter<"AccessEvent"> | string
    qrTokenId?: StringNullableFilter<"AccessEvent"> | string | null
    direction?: EnumGateDirectionFilter<"AccessEvent"> | $Enums.GateDirection
    source?: EnumAccessSourceFilter<"AccessEvent"> | $Enums.AccessSource
    decision?: EnumAccessDecisionFilter<"AccessEvent"> | $Enums.AccessDecision
    reasonCode?: StringNullableFilter<"AccessEvent"> | string | null
    ipAddress?: StringNullableFilter<"AccessEvent"> | string | null
    userAgent?: StringNullableFilter<"AccessEvent"> | string | null
    metadata?: JsonNullableFilter<"AccessEvent">
    scannedAt?: DateTimeFilter<"AccessEvent"> | Date | string
    createdAt?: DateTimeFilter<"AccessEvent"> | Date | string
  }

  export type DeviceRegistryUpsertWithWhereUniqueWithoutGateInput = {
    where: DeviceRegistryWhereUniqueInput
    update: XOR<DeviceRegistryUpdateWithoutGateInput, DeviceRegistryUncheckedUpdateWithoutGateInput>
    create: XOR<DeviceRegistryCreateWithoutGateInput, DeviceRegistryUncheckedCreateWithoutGateInput>
  }

  export type DeviceRegistryUpdateWithWhereUniqueWithoutGateInput = {
    where: DeviceRegistryWhereUniqueInput
    data: XOR<DeviceRegistryUpdateWithoutGateInput, DeviceRegistryUncheckedUpdateWithoutGateInput>
  }

  export type DeviceRegistryUpdateManyWithWhereWithoutGateInput = {
    where: DeviceRegistryScalarWhereInput
    data: XOR<DeviceRegistryUpdateManyMutationInput, DeviceRegistryUncheckedUpdateManyWithoutGateInput>
  }

  export type DeviceRegistryScalarWhereInput = {
    AND?: DeviceRegistryScalarWhereInput | DeviceRegistryScalarWhereInput[]
    OR?: DeviceRegistryScalarWhereInput[]
    NOT?: DeviceRegistryScalarWhereInput | DeviceRegistryScalarWhereInput[]
    id?: StringFilter<"DeviceRegistry"> | string
    deviceCode?: StringFilter<"DeviceRegistry"> | string
    name?: StringFilter<"DeviceRegistry"> | string
    gateId?: StringFilter<"DeviceRegistry"> | string
    deviceType?: EnumDeviceTypeFilter<"DeviceRegistry"> | $Enums.DeviceType
    secretHash?: StringFilter<"DeviceRegistry"> | string
    status?: EnumDeviceStatusFilter<"DeviceRegistry"> | $Enums.DeviceStatus
    lastSeenAt?: DateTimeNullableFilter<"DeviceRegistry"> | Date | string | null
    createdAt?: DateTimeFilter<"DeviceRegistry"> | Date | string
    updatedAt?: DateTimeFilter<"DeviceRegistry"> | Date | string
  }

  export type QrTokenCreateWithoutMemberInput = {
    id?: string
    tokenHash: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    accessEvent?: AccessEventCreateNestedOneWithoutQrTokenInput
  }

  export type QrTokenUncheckedCreateWithoutMemberInput = {
    id?: string
    tokenHash: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    accessEvent?: AccessEventUncheckedCreateNestedOneWithoutQrTokenInput
  }

  export type QrTokenCreateOrConnectWithoutMemberInput = {
    where: QrTokenWhereUniqueInput
    create: XOR<QrTokenCreateWithoutMemberInput, QrTokenUncheckedCreateWithoutMemberInput>
  }

  export type QrTokenCreateManyMemberInputEnvelope = {
    data: QrTokenCreateManyMemberInput | QrTokenCreateManyMemberInput[]
  }

  export type AccessEventCreateWithoutMemberInput = {
    id?: string
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
    gate: GateCreateNestedOneWithoutAccessEventsInput
    qrToken?: QrTokenCreateNestedOneWithoutAccessEventInput
  }

  export type AccessEventUncheckedCreateWithoutMemberInput = {
    id?: string
    gateId: string
    qrTokenId?: string | null
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type AccessEventCreateOrConnectWithoutMemberInput = {
    where: AccessEventWhereUniqueInput
    create: XOR<AccessEventCreateWithoutMemberInput, AccessEventUncheckedCreateWithoutMemberInput>
  }

  export type AccessEventCreateManyMemberInputEnvelope = {
    data: AccessEventCreateManyMemberInput | AccessEventCreateManyMemberInput[]
  }

  export type IdCardSessionCreateWithoutMemberInput = {
    id?: string
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
    device?: DeviceRegistryCreateNestedOneWithoutIdCardSessionsInput
  }

  export type IdCardSessionUncheckedCreateWithoutMemberInput = {
    id?: string
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    deviceId?: string | null
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
  }

  export type IdCardSessionCreateOrConnectWithoutMemberInput = {
    where: IdCardSessionWhereUniqueInput
    create: XOR<IdCardSessionCreateWithoutMemberInput, IdCardSessionUncheckedCreateWithoutMemberInput>
  }

  export type IdCardSessionCreateManyMemberInputEnvelope = {
    data: IdCardSessionCreateManyMemberInput | IdCardSessionCreateManyMemberInput[]
  }

  export type QrTokenUpsertWithWhereUniqueWithoutMemberInput = {
    where: QrTokenWhereUniqueInput
    update: XOR<QrTokenUpdateWithoutMemberInput, QrTokenUncheckedUpdateWithoutMemberInput>
    create: XOR<QrTokenCreateWithoutMemberInput, QrTokenUncheckedCreateWithoutMemberInput>
  }

  export type QrTokenUpdateWithWhereUniqueWithoutMemberInput = {
    where: QrTokenWhereUniqueInput
    data: XOR<QrTokenUpdateWithoutMemberInput, QrTokenUncheckedUpdateWithoutMemberInput>
  }

  export type QrTokenUpdateManyWithWhereWithoutMemberInput = {
    where: QrTokenScalarWhereInput
    data: XOR<QrTokenUpdateManyMutationInput, QrTokenUncheckedUpdateManyWithoutMemberInput>
  }

  export type QrTokenScalarWhereInput = {
    AND?: QrTokenScalarWhereInput | QrTokenScalarWhereInput[]
    OR?: QrTokenScalarWhereInput[]
    NOT?: QrTokenScalarWhereInput | QrTokenScalarWhereInput[]
    id?: StringFilter<"QrToken"> | string
    tokenHash?: StringFilter<"QrToken"> | string
    memberId?: StringFilter<"QrToken"> | string
    purpose?: EnumQrPurposeFilter<"QrToken"> | $Enums.QrPurpose
    issuedDate?: DateTimeFilter<"QrToken"> | Date | string
    expiresAt?: DateTimeFilter<"QrToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"QrToken"> | Date | string | null
    revokedAt?: DateTimeNullableFilter<"QrToken"> | Date | string | null
    ipAddress?: StringNullableFilter<"QrToken"> | string | null
    userAgent?: StringNullableFilter<"QrToken"> | string | null
    createdAt?: DateTimeFilter<"QrToken"> | Date | string
  }

  export type AccessEventUpsertWithWhereUniqueWithoutMemberInput = {
    where: AccessEventWhereUniqueInput
    update: XOR<AccessEventUpdateWithoutMemberInput, AccessEventUncheckedUpdateWithoutMemberInput>
    create: XOR<AccessEventCreateWithoutMemberInput, AccessEventUncheckedCreateWithoutMemberInput>
  }

  export type AccessEventUpdateWithWhereUniqueWithoutMemberInput = {
    where: AccessEventWhereUniqueInput
    data: XOR<AccessEventUpdateWithoutMemberInput, AccessEventUncheckedUpdateWithoutMemberInput>
  }

  export type AccessEventUpdateManyWithWhereWithoutMemberInput = {
    where: AccessEventScalarWhereInput
    data: XOR<AccessEventUpdateManyMutationInput, AccessEventUncheckedUpdateManyWithoutMemberInput>
  }

  export type IdCardSessionUpsertWithWhereUniqueWithoutMemberInput = {
    where: IdCardSessionWhereUniqueInput
    update: XOR<IdCardSessionUpdateWithoutMemberInput, IdCardSessionUncheckedUpdateWithoutMemberInput>
    create: XOR<IdCardSessionCreateWithoutMemberInput, IdCardSessionUncheckedCreateWithoutMemberInput>
  }

  export type IdCardSessionUpdateWithWhereUniqueWithoutMemberInput = {
    where: IdCardSessionWhereUniqueInput
    data: XOR<IdCardSessionUpdateWithoutMemberInput, IdCardSessionUncheckedUpdateWithoutMemberInput>
  }

  export type IdCardSessionUpdateManyWithWhereWithoutMemberInput = {
    where: IdCardSessionScalarWhereInput
    data: XOR<IdCardSessionUpdateManyMutationInput, IdCardSessionUncheckedUpdateManyWithoutMemberInput>
  }

  export type IdCardSessionScalarWhereInput = {
    AND?: IdCardSessionScalarWhereInput | IdCardSessionScalarWhereInput[]
    OR?: IdCardSessionScalarWhereInput[]
    NOT?: IdCardSessionScalarWhereInput | IdCardSessionScalarWhereInput[]
    id?: StringFilter<"IdCardSession"> | string
    memberId?: StringNullableFilter<"IdCardSession"> | string | null
    citizenId?: StringFilter<"IdCardSession"> | string
    fullNameTh?: StringFilter<"IdCardSession"> | string
    fullNameEn?: StringNullableFilter<"IdCardSession"> | string | null
    birthDate?: DateTimeNullableFilter<"IdCardSession"> | Date | string | null
    address?: StringNullableFilter<"IdCardSession"> | string | null
    photoRead?: BoolFilter<"IdCardSession"> | boolean
    deviceId?: StringNullableFilter<"IdCardSession"> | string | null
    status?: EnumIdCardReadStatusFilter<"IdCardSession"> | $Enums.IdCardReadStatus
    readAt?: DateTimeFilter<"IdCardSession"> | Date | string
    createdAt?: DateTimeFilter<"IdCardSession"> | Date | string
  }

  export type MemberCreateWithoutQrTokensInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    accessEvents?: AccessEventCreateNestedManyWithoutMemberInput
    idCardSessions?: IdCardSessionCreateNestedManyWithoutMemberInput
  }

  export type MemberUncheckedCreateWithoutQrTokensInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    accessEvents?: AccessEventUncheckedCreateNestedManyWithoutMemberInput
    idCardSessions?: IdCardSessionUncheckedCreateNestedManyWithoutMemberInput
  }

  export type MemberCreateOrConnectWithoutQrTokensInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutQrTokensInput, MemberUncheckedCreateWithoutQrTokensInput>
  }

  export type AccessEventCreateWithoutQrTokenInput = {
    id?: string
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
    gate: GateCreateNestedOneWithoutAccessEventsInput
    member: MemberCreateNestedOneWithoutAccessEventsInput
  }

  export type AccessEventUncheckedCreateWithoutQrTokenInput = {
    id?: string
    gateId: string
    memberId: string
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type AccessEventCreateOrConnectWithoutQrTokenInput = {
    where: AccessEventWhereUniqueInput
    create: XOR<AccessEventCreateWithoutQrTokenInput, AccessEventUncheckedCreateWithoutQrTokenInput>
  }

  export type MemberUpsertWithoutQrTokensInput = {
    update: XOR<MemberUpdateWithoutQrTokensInput, MemberUncheckedUpdateWithoutQrTokensInput>
    create: XOR<MemberCreateWithoutQrTokensInput, MemberUncheckedCreateWithoutQrTokensInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutQrTokensInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutQrTokensInput, MemberUncheckedUpdateWithoutQrTokensInput>
  }

  export type MemberUpdateWithoutQrTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvents?: AccessEventUpdateManyWithoutMemberNestedInput
    idCardSessions?: IdCardSessionUpdateManyWithoutMemberNestedInput
  }

  export type MemberUncheckedUpdateWithoutQrTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvents?: AccessEventUncheckedUpdateManyWithoutMemberNestedInput
    idCardSessions?: IdCardSessionUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type AccessEventUpsertWithoutQrTokenInput = {
    update: XOR<AccessEventUpdateWithoutQrTokenInput, AccessEventUncheckedUpdateWithoutQrTokenInput>
    create: XOR<AccessEventCreateWithoutQrTokenInput, AccessEventUncheckedCreateWithoutQrTokenInput>
    where?: AccessEventWhereInput
  }

  export type AccessEventUpdateToOneWithWhereWithoutQrTokenInput = {
    where?: AccessEventWhereInput
    data: XOR<AccessEventUpdateWithoutQrTokenInput, AccessEventUncheckedUpdateWithoutQrTokenInput>
  }

  export type AccessEventUpdateWithoutQrTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gate?: GateUpdateOneRequiredWithoutAccessEventsNestedInput
    member?: MemberUpdateOneRequiredWithoutAccessEventsNestedInput
  }

  export type AccessEventUncheckedUpdateWithoutQrTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateCreateWithoutAccessEventsInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    branch: BranchCreateNestedOneWithoutGatesInput
    devices?: DeviceRegistryCreateNestedManyWithoutGateInput
  }

  export type GateUncheckedCreateWithoutAccessEventsInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    branchId: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    devices?: DeviceRegistryUncheckedCreateNestedManyWithoutGateInput
  }

  export type GateCreateOrConnectWithoutAccessEventsInput = {
    where: GateWhereUniqueInput
    create: XOR<GateCreateWithoutAccessEventsInput, GateUncheckedCreateWithoutAccessEventsInput>
  }

  export type MemberCreateWithoutAccessEventsInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    qrTokens?: QrTokenCreateNestedManyWithoutMemberInput
    idCardSessions?: IdCardSessionCreateNestedManyWithoutMemberInput
  }

  export type MemberUncheckedCreateWithoutAccessEventsInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    qrTokens?: QrTokenUncheckedCreateNestedManyWithoutMemberInput
    idCardSessions?: IdCardSessionUncheckedCreateNestedManyWithoutMemberInput
  }

  export type MemberCreateOrConnectWithoutAccessEventsInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutAccessEventsInput, MemberUncheckedCreateWithoutAccessEventsInput>
  }

  export type QrTokenCreateWithoutAccessEventInput = {
    id?: string
    tokenHash: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    member: MemberCreateNestedOneWithoutQrTokensInput
  }

  export type QrTokenUncheckedCreateWithoutAccessEventInput = {
    id?: string
    tokenHash: string
    memberId: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type QrTokenCreateOrConnectWithoutAccessEventInput = {
    where: QrTokenWhereUniqueInput
    create: XOR<QrTokenCreateWithoutAccessEventInput, QrTokenUncheckedCreateWithoutAccessEventInput>
  }

  export type GateUpsertWithoutAccessEventsInput = {
    update: XOR<GateUpdateWithoutAccessEventsInput, GateUncheckedUpdateWithoutAccessEventsInput>
    create: XOR<GateCreateWithoutAccessEventsInput, GateUncheckedCreateWithoutAccessEventsInput>
    where?: GateWhereInput
  }

  export type GateUpdateToOneWithWhereWithoutAccessEventsInput = {
    where?: GateWhereInput
    data: XOR<GateUpdateWithoutAccessEventsInput, GateUncheckedUpdateWithoutAccessEventsInput>
  }

  export type GateUpdateWithoutAccessEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneRequiredWithoutGatesNestedInput
    devices?: DeviceRegistryUpdateManyWithoutGateNestedInput
  }

  export type GateUncheckedUpdateWithoutAccessEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    branchId?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    devices?: DeviceRegistryUncheckedUpdateManyWithoutGateNestedInput
  }

  export type MemberUpsertWithoutAccessEventsInput = {
    update: XOR<MemberUpdateWithoutAccessEventsInput, MemberUncheckedUpdateWithoutAccessEventsInput>
    create: XOR<MemberCreateWithoutAccessEventsInput, MemberUncheckedCreateWithoutAccessEventsInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutAccessEventsInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutAccessEventsInput, MemberUncheckedUpdateWithoutAccessEventsInput>
  }

  export type MemberUpdateWithoutAccessEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrTokens?: QrTokenUpdateManyWithoutMemberNestedInput
    idCardSessions?: IdCardSessionUpdateManyWithoutMemberNestedInput
  }

  export type MemberUncheckedUpdateWithoutAccessEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrTokens?: QrTokenUncheckedUpdateManyWithoutMemberNestedInput
    idCardSessions?: IdCardSessionUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type QrTokenUpsertWithoutAccessEventInput = {
    update: XOR<QrTokenUpdateWithoutAccessEventInput, QrTokenUncheckedUpdateWithoutAccessEventInput>
    create: XOR<QrTokenCreateWithoutAccessEventInput, QrTokenUncheckedCreateWithoutAccessEventInput>
    where?: QrTokenWhereInput
  }

  export type QrTokenUpdateToOneWithWhereWithoutAccessEventInput = {
    where?: QrTokenWhereInput
    data: XOR<QrTokenUpdateWithoutAccessEventInput, QrTokenUncheckedUpdateWithoutAccessEventInput>
  }

  export type QrTokenUpdateWithoutAccessEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneRequiredWithoutQrTokensNestedInput
  }

  export type QrTokenUncheckedUpdateWithoutAccessEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateCreateWithoutDevicesInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    branch: BranchCreateNestedOneWithoutGatesInput
    accessEvents?: AccessEventCreateNestedManyWithoutGateInput
  }

  export type GateUncheckedCreateWithoutDevicesInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    branchId: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    accessEvents?: AccessEventUncheckedCreateNestedManyWithoutGateInput
  }

  export type GateCreateOrConnectWithoutDevicesInput = {
    where: GateWhereUniqueInput
    create: XOR<GateCreateWithoutDevicesInput, GateUncheckedCreateWithoutDevicesInput>
  }

  export type IdCardSessionCreateWithoutDeviceInput = {
    id?: string
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
    member?: MemberCreateNestedOneWithoutIdCardSessionsInput
  }

  export type IdCardSessionUncheckedCreateWithoutDeviceInput = {
    id?: string
    memberId?: string | null
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
  }

  export type IdCardSessionCreateOrConnectWithoutDeviceInput = {
    where: IdCardSessionWhereUniqueInput
    create: XOR<IdCardSessionCreateWithoutDeviceInput, IdCardSessionUncheckedCreateWithoutDeviceInput>
  }

  export type IdCardSessionCreateManyDeviceInputEnvelope = {
    data: IdCardSessionCreateManyDeviceInput | IdCardSessionCreateManyDeviceInput[]
  }

  export type GateUpsertWithoutDevicesInput = {
    update: XOR<GateUpdateWithoutDevicesInput, GateUncheckedUpdateWithoutDevicesInput>
    create: XOR<GateCreateWithoutDevicesInput, GateUncheckedCreateWithoutDevicesInput>
    where?: GateWhereInput
  }

  export type GateUpdateToOneWithWhereWithoutDevicesInput = {
    where?: GateWhereInput
    data: XOR<GateUpdateWithoutDevicesInput, GateUncheckedUpdateWithoutDevicesInput>
  }

  export type GateUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    branch?: BranchUpdateOneRequiredWithoutGatesNestedInput
    accessEvents?: AccessEventUpdateManyWithoutGateNestedInput
  }

  export type GateUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    branchId?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvents?: AccessEventUncheckedUpdateManyWithoutGateNestedInput
  }

  export type IdCardSessionUpsertWithWhereUniqueWithoutDeviceInput = {
    where: IdCardSessionWhereUniqueInput
    update: XOR<IdCardSessionUpdateWithoutDeviceInput, IdCardSessionUncheckedUpdateWithoutDeviceInput>
    create: XOR<IdCardSessionCreateWithoutDeviceInput, IdCardSessionUncheckedCreateWithoutDeviceInput>
  }

  export type IdCardSessionUpdateWithWhereUniqueWithoutDeviceInput = {
    where: IdCardSessionWhereUniqueInput
    data: XOR<IdCardSessionUpdateWithoutDeviceInput, IdCardSessionUncheckedUpdateWithoutDeviceInput>
  }

  export type IdCardSessionUpdateManyWithWhereWithoutDeviceInput = {
    where: IdCardSessionScalarWhereInput
    data: XOR<IdCardSessionUpdateManyMutationInput, IdCardSessionUncheckedUpdateManyWithoutDeviceInput>
  }

  export type MemberCreateWithoutIdCardSessionsInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    qrTokens?: QrTokenCreateNestedManyWithoutMemberInput
    accessEvents?: AccessEventCreateNestedManyWithoutMemberInput
  }

  export type MemberUncheckedCreateWithoutIdCardSessionsInput = {
    id?: string
    memberNo: string
    citizenId?: string | null
    firstNameTh: string
    lastNameTh: string
    firstNameEn?: string | null
    lastNameEn?: string | null
    firstNameZh?: string | null
    lastNameZh?: string | null
    email?: string | null
    phone?: string | null
    memberType?: $Enums.MemberType
    status?: $Enums.MemberStatus
    expireDate?: Date | string | null
    photo?: Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    qrTokens?: QrTokenUncheckedCreateNestedManyWithoutMemberInput
    accessEvents?: AccessEventUncheckedCreateNestedManyWithoutMemberInput
  }

  export type MemberCreateOrConnectWithoutIdCardSessionsInput = {
    where: MemberWhereUniqueInput
    create: XOR<MemberCreateWithoutIdCardSessionsInput, MemberUncheckedCreateWithoutIdCardSessionsInput>
  }

  export type DeviceRegistryCreateWithoutIdCardSessionsInput = {
    id?: string
    deviceCode: string
    name: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    gate: GateCreateNestedOneWithoutDevicesInput
  }

  export type DeviceRegistryUncheckedCreateWithoutIdCardSessionsInput = {
    id?: string
    deviceCode: string
    name: string
    gateId: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeviceRegistryCreateOrConnectWithoutIdCardSessionsInput = {
    where: DeviceRegistryWhereUniqueInput
    create: XOR<DeviceRegistryCreateWithoutIdCardSessionsInput, DeviceRegistryUncheckedCreateWithoutIdCardSessionsInput>
  }

  export type MemberUpsertWithoutIdCardSessionsInput = {
    update: XOR<MemberUpdateWithoutIdCardSessionsInput, MemberUncheckedUpdateWithoutIdCardSessionsInput>
    create: XOR<MemberCreateWithoutIdCardSessionsInput, MemberUncheckedCreateWithoutIdCardSessionsInput>
    where?: MemberWhereInput
  }

  export type MemberUpdateToOneWithWhereWithoutIdCardSessionsInput = {
    where?: MemberWhereInput
    data: XOR<MemberUpdateWithoutIdCardSessionsInput, MemberUncheckedUpdateWithoutIdCardSessionsInput>
  }

  export type MemberUpdateWithoutIdCardSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrTokens?: QrTokenUpdateManyWithoutMemberNestedInput
    accessEvents?: AccessEventUpdateManyWithoutMemberNestedInput
  }

  export type MemberUncheckedUpdateWithoutIdCardSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberNo?: StringFieldUpdateOperationsInput | string
    citizenId?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameTh?: StringFieldUpdateOperationsInput | string
    lastNameTh?: StringFieldUpdateOperationsInput | string
    firstNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    firstNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    lastNameZh?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    memberType?: EnumMemberTypeFieldUpdateOperationsInput | $Enums.MemberType
    status?: EnumMemberStatusFieldUpdateOperationsInput | $Enums.MemberStatus
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    photo?: NullableBytesFieldUpdateOperationsInput | Bytes | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    qrTokens?: QrTokenUncheckedUpdateManyWithoutMemberNestedInput
    accessEvents?: AccessEventUncheckedUpdateManyWithoutMemberNestedInput
  }

  export type DeviceRegistryUpsertWithoutIdCardSessionsInput = {
    update: XOR<DeviceRegistryUpdateWithoutIdCardSessionsInput, DeviceRegistryUncheckedUpdateWithoutIdCardSessionsInput>
    create: XOR<DeviceRegistryCreateWithoutIdCardSessionsInput, DeviceRegistryUncheckedCreateWithoutIdCardSessionsInput>
    where?: DeviceRegistryWhereInput
  }

  export type DeviceRegistryUpdateToOneWithWhereWithoutIdCardSessionsInput = {
    where?: DeviceRegistryWhereInput
    data: XOR<DeviceRegistryUpdateWithoutIdCardSessionsInput, DeviceRegistryUncheckedUpdateWithoutIdCardSessionsInput>
  }

  export type DeviceRegistryUpdateWithoutIdCardSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gate?: GateUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceRegistryUncheckedUpdateWithoutIdCardSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    passwordHash: string
    fullName: string
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    action: string
    resource: string
    resourceId?: string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    resourceId?: NullableStringFieldUpdateOperationsInput | string | null
    dataBefore?: NullableJsonNullValueInput | InputJsonValue
    dataAfter?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GateCreateManyBranchInput = {
    id?: string
    gateCode: string
    nameTh: string
    nameEn: string
    nameZh: string
    direction?: $Enums.GateDirection
    status?: $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GateUpdateWithoutBranchInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvents?: AccessEventUpdateManyWithoutGateNestedInput
    devices?: DeviceRegistryUpdateManyWithoutGateNestedInput
  }

  export type GateUncheckedUpdateWithoutBranchInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvents?: AccessEventUncheckedUpdateManyWithoutGateNestedInput
    devices?: DeviceRegistryUncheckedUpdateManyWithoutGateNestedInput
  }

  export type GateUncheckedUpdateManyWithoutBranchInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateCode?: StringFieldUpdateOperationsInput | string
    nameTh?: StringFieldUpdateOperationsInput | string
    nameEn?: StringFieldUpdateOperationsInput | string
    nameZh?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    status?: EnumGateStatusFieldUpdateOperationsInput | $Enums.GateStatus
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventCreateManyGateInput = {
    id?: string
    memberId: string
    qrTokenId?: string | null
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type DeviceRegistryCreateManyGateInput = {
    id?: string
    deviceCode: string
    name: string
    deviceType: $Enums.DeviceType
    secretHash: string
    status?: $Enums.DeviceStatus
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccessEventUpdateWithoutGateInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneRequiredWithoutAccessEventsNestedInput
    qrToken?: QrTokenUpdateOneWithoutAccessEventNestedInput
  }

  export type AccessEventUncheckedUpdateWithoutGateInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    qrTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventUncheckedUpdateManyWithoutGateInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: StringFieldUpdateOperationsInput | string
    qrTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceRegistryUpdateWithoutGateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idCardSessions?: IdCardSessionUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceRegistryUncheckedUpdateWithoutGateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    idCardSessions?: IdCardSessionUncheckedUpdateManyWithoutDeviceNestedInput
  }

  export type DeviceRegistryUncheckedUpdateManyWithoutGateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deviceCode?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deviceType?: EnumDeviceTypeFieldUpdateOperationsInput | $Enums.DeviceType
    secretHash?: StringFieldUpdateOperationsInput | string
    status?: EnumDeviceStatusFieldUpdateOperationsInput | $Enums.DeviceStatus
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QrTokenCreateManyMemberInput = {
    id?: string
    tokenHash: string
    purpose?: $Enums.QrPurpose
    issuedDate: Date | string
    expiresAt: Date | string
    usedAt?: Date | string | null
    revokedAt?: Date | string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AccessEventCreateManyMemberInput = {
    id?: string
    gateId: string
    qrTokenId?: string | null
    direction: $Enums.GateDirection
    source?: $Enums.AccessSource
    decision: $Enums.AccessDecision
    reasonCode?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt: Date | string
    createdAt?: Date | string
  }

  export type IdCardSessionCreateManyMemberInput = {
    id?: string
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    deviceId?: string | null
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
  }

  export type QrTokenUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvent?: AccessEventUpdateOneWithoutQrTokenNestedInput
  }

  export type QrTokenUncheckedUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accessEvent?: AccessEventUncheckedUpdateOneWithoutQrTokenNestedInput
  }

  export type QrTokenUncheckedUpdateManyWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: EnumQrPurposeFieldUpdateOperationsInput | $Enums.QrPurpose
    issuedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gate?: GateUpdateOneRequiredWithoutAccessEventsNestedInput
    qrToken?: QrTokenUpdateOneWithoutAccessEventNestedInput
  }

  export type AccessEventUncheckedUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    qrTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccessEventUncheckedUpdateManyWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    gateId?: StringFieldUpdateOperationsInput | string
    qrTokenId?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: EnumGateDirectionFieldUpdateOperationsInput | $Enums.GateDirection
    source?: EnumAccessSourceFieldUpdateOperationsInput | $Enums.AccessSource
    decision?: EnumAccessDecisionFieldUpdateOperationsInput | $Enums.AccessDecision
    reasonCode?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    scannedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    device?: DeviceRegistryUpdateOneWithoutIdCardSessionsNestedInput
  }

  export type IdCardSessionUncheckedUpdateWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionUncheckedUpdateManyWithoutMemberInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    deviceId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionCreateManyDeviceInput = {
    id?: string
    memberId?: string | null
    citizenId: string
    fullNameTh: string
    fullNameEn?: string | null
    birthDate?: Date | string | null
    address?: string | null
    photoRead?: boolean
    status: $Enums.IdCardReadStatus
    readAt: Date | string
    createdAt?: Date | string
  }

  export type IdCardSessionUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    member?: MemberUpdateOneWithoutIdCardSessionsNestedInput
  }

  export type IdCardSessionUncheckedUpdateWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdCardSessionUncheckedUpdateManyWithoutDeviceInput = {
    id?: StringFieldUpdateOperationsInput | string
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    citizenId?: StringFieldUpdateOperationsInput | string
    fullNameTh?: StringFieldUpdateOperationsInput | string
    fullNameEn?: NullableStringFieldUpdateOperationsInput | string | null
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    photoRead?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumIdCardReadStatusFieldUpdateOperationsInput | $Enums.IdCardReadStatus
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}