import { __ } from "@wordpress/i18n";
import { RawHTML } from "@wordpress/element";
import { format, dateI18n, __experimentalGetSettings } from "@wordpress/date";
import { PanelBody, ToggleControl, QueryControls, RangeControl } from "@wordpress/components";

import { useBlockProps, InspectorControls  } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";

import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
  const { numberOfPosts, displayFeaturedImage,order, orderBy, gridTemplateColumns } = attributes;

  const TemplateColumns = {
    gridTemplateColumns : `repeat(${gridTemplateColumns}, 1fr)`
  }
  const posts = useSelect(
    select =>
      select("core").getEntityRecords("postType", "post", {
        per_page: numberOfPosts,
        _embed: true,
        order, 
        orderby : orderBy
      }),
    [numberOfPosts, order, orderBy]
  );

  const onDisplayFeaturedImage = (value) =>{
    setAttributes({displayFeaturedImage : value})
  }

  const onNumberOfItemsChange = (value)=>{
    setAttributes({numberOfPosts : value})
  }
  
  return (
    <>
    <InspectorControls>
      <PanelBody>
        <ToggleControl 
          label={__('Display Featured Image', 'dynamic-list')}
          checked ={displayFeaturedImage}
          onChange={onDisplayFeaturedImage}
        />

        <QueryControls 
          numberOfItems={numberOfPosts} 
          onNumberOfItemsChange={onNumberOfItemsChange} 
          minItems={1} 
          maxItems ={ 10 }
          orderBy= {orderBy}
          onOrderByChange={(value) => setAttributes({orderBy : value})}
          order={order}
          onOrderChange={(value) => setAttributes({order : value})}
        />

        <RangeControl 
        label = 'control how many column' 
        min={ 1 } 
        max={ 5 } 
        step={ 1 }
        value={gridTemplateColumns}
        onChange = {(val) => setAttributes({gridTemplateColumns : val})}
         />

      </PanelBody>
    </InspectorControls>
    <ul {...useBlockProps({ className: ` has-${gridTemplateColumns}` })}>
      {posts &&
        posts.map(post =>
          <li key={post.id}>
            {displayFeaturedImage &&
              post._embedded &&
              post._embedded["wp:featuredmedia"] &&
              post._embedded["wp:featuredmedia"].length > 0 &&
              post._embedded["wp:featuredmedia"][0] &&
              <img
                src={
                  post._embedded["wp:featuredmedia"][0].media_details.sizes
                    .full.source_url
                }
                alt={post.alt_text}
              />}
            <h5>
              <a href={post.link}>
                {post.title.rendered
                  ? <RawHTML>
                      {" "}{post.title.rendered}
                    </RawHTML>
                  : __("(No Title)", "dynamic-list")}
              </a>
            </h5>

            {post.date_gmt &&
              <time dateTime={(format("c"), post.date_gmt)}>
                {dateI18n(
                  __experimentalGetSettings().formats.date,
                  post.date_gmt
                )}
              </time>}

            {post.excerpt.rendered &&
              <RawHTML>
                {post.excerpt.rendered}
              </RawHTML>}
          </li>
        )}
    </ul>
    </>
    );
}
