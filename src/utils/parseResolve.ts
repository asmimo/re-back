import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from "graphql-parse-resolve-info";
import { GraphQLResolveInfo } from "graphql";

export default (
  info: GraphQLResolveInfo,
  relations: string[]
): string[] | undefined => {
  const parsedResolveInfoFragment = parseResolveInfo(info);
  const simplifledFragment = simplifyParsedResolveInfoFragmentWithType(
    // @ts-ignore
    parsedResolveInfoFragment,
    info.returnType
  );
  const result = Object.keys(simplifledFragment.fields).filter((field) =>
    relations.includes(field)
  );

  return result.length === 0 ? undefined : result;
};
