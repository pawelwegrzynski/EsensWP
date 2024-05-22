( function( blocks, element, data ) {
 
    var createElement = element.createElement,
    registerBlockType = blocks.registerBlockType,
    withSelect = data.withSelect;
 
    registerBlockType( 'team-members/team-members-block', {
        title: 'Team Members',
        icon: 'groups',
        category: 'widgets',
 
        edit: withSelect( function( select ) {
            return {
                posts: select( 'core' ).getEntityRecords( 'postType', 'teammember' )
            };
        } )( function( props ) {
 
            if ( ! props.posts ) {
                return "Loading...";
            }
 
            if ( props.posts.length === 0 ) {
                return "No team members";
            }

            var teamMemberItems = [];
            for (var i = 0; i < props.posts.length; ++i) {

                var className = props.className;
                var post = props.posts[ i ];
     
                teamMemberItems.push( 
                    createElement('li', null,
                        [
                        createElement('h4', null, post.title.rendered),
                        createElement( 'a',
                            { className: className,
                              href: post.link },
                              post.excerpt.raw
                            ),
                        ]
                    ) );
            }

            return createElement('ul', {id: 'teammembers-grid'}, teamMemberItems);
        } ),

        save: function( {attributes} ) {

            return createElement('div', null, 'Showcase Your Team');

        },
    } );
}(
    window.wp.blocks,
    window.wp.element,
    window.wp.data,
) );
