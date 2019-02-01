import { SubmissionType } from "./submission"
import { GraphQLBoolean } from "graphql/type/scalars"

import { pageable } from "relay-cursor-paging"
import { connectionDefinitions, connectionFromArraySlice } from "graphql-relay"
import { GraphQLFieldConfig } from "graphql"
import { ResolverContext } from "types/graphql"

const Submissions: GraphQLFieldConfig<void, ResolverContext> = {
  type: connectionDefinitions({ nodeType: SubmissionType }).connectionType,
  args: {
    ...pageable({}),

    completed: {
      type: GraphQLBoolean,
      default: true,
    },
  },
  description: "A list of the current user’s consignment submissions",
  resolve: (_root, options, { submissionsLoader }) => {
    // TODO: This should get replaced in stitching,
    //       it _does not_ handle pagination at API level, so you'll need a
    //       list size that's a little higher than average while there
    //       are still small amounts of data.
    if (!submissionsLoader) return null
    return submissionsLoader(options).then(body => {
      return connectionFromArraySlice(body, options, {
        arrayLength: body.length,
        sliceStart: 0,
      })
    })
  },
}

export default Submissions
