<?php

/**
 * Plugin Name:       Dynamic List
 * Description:       envo dynamic list by Rahaf.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           1.0
 * Author:            Rahaf Sabagh
 * License:           GPL-2.0-or-later 
 * Text Domain:       dynamic-list
 *
 * @package          dynamic-list
 */


function posts_block($attributes)
{
	// var_dump($attributes);
	$args = array(

		'posts_per_page' => $attributes['numberOfPosts'],
		'post_status' => 'publish',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy']
	);

	$recent_posts = get_posts($args);

	$posts = '<ul ' . get_block_wrapper_attributes() . '>';

	foreach ($recent_posts  as $post) {
		$title = get_the_title($post);
		$title = $title ?: __('(No Title)', 'latest-posts');
		$permalink = get_permalink($post);
		$excerpt = get_the_excerpt($post);

		$posts .= '<li>';

		if ($attributes["displayFeaturedImage"] && has_post_thumbnail($post)) {
			$posts .= get_the_post_thumbnail($post, 'medium_large');
		}

		$posts .= '<h5><a href="' . esc_url($permalink) . '">' . $title . '</a></h5>';
		$posts .= '<time datatime ="' . esc_attr(get_the_date('c', $post)) . '">' . esc_html(get_the_date('', $post)) . '</time>';
		if (!empty($excerpt)) {
			$posts .= '<p>' . $excerpt . '</p>';
		}

		$posts .= '</li>';
	}
	$posts .= '</ul>';

	return $posts;
}

function create_block_dynamic_list_block_init()
{
	// register_block_type(__DIR__ . '/build');
	register_block_type(__DIR__ . '/build', array(
		'render_callback' => 'posts_block'
	));

	// register_block_type_from_metadata(__DIR__, array(
	// 	'render_callback' => 'posts_block'
	// ));
}
add_action('init', 'create_block_dynamic_list_block_init');
