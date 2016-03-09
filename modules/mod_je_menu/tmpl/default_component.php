<?php
/**
 * @package		Joomla.Site
 * @subpackage	mod_menu
 * @copyright	Copyright (C) 2005 - 2012 Open Source Matters, Inc. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access.
defined('_JEXEC') or die;

// Note. It is important to remove spaces between elements.
$class = $item->anchor_css ? 'class="'.$item->anchor_css.'" ' : '';
$title = $item->anchor_title ? $item->anchor_title : '';
switch ($item->browserNav) :
	default:
	case 0:?>
    <?php if ($item->level > 1) { ?><a <?php echo $class; ?> href="<?php echo $item->flink; ?>"><?php echo $item->title; ?></a><?php } else { ?><a <?php echo $class; ?> href="<?php echo $item->flink; ?>"><?php if (($item->menu_image) != '') {echo '<img src="'.$item->menu_image.'" />';}?><span class="sdt_active"></span><span class="sdt_wrap"><span class="sdt_link"><?php echo $item->title;?></span><span class="sdt_descr"><?php echo $title; ?></span></span></a><?php } ?>
	<?php
		break;
	case 1:
		// _blank
?><a <?php echo $class; ?>href="<?php echo $item->flink; ?>" target="_blank" <?php echo $title; ?>><?php echo $linktype; ?></a><?php
		break;
	case 2:
	// window.open
?><a <?php echo $class; ?>href="<?php echo $item->flink; ?>" onclick="window.open(this.href,'targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');return false;" <?php echo $title; ?>><?php echo $linktype; ?></a>
<?php
		break;
endswitch; ?>
