<?php
namespace Web_Disrupt_Task_Runner;

class base {

    /**
     * Main Constructor that sets up all static data associated with this plugin.
     *
     * @since  1.0.0
     * @return void
     */
    public function __construct() {

        // Add Actions
        add_action("wp_ajax_task_runner_editor_load_library", [$this, "load_library"]);
        add_action("wp_ajax_task_runner_editor_save_tasker", [$this, "save_tasker"]);
        add_action("wp_ajax_task_runner_editor_delete_tasker", [$this, "delete_tasker"]);
        add_action("wp_ajax_task_runner_editor_export_all_tasker", [$this, "export_all_tasker"]);

    }

  	/**
	 * Loads all Built-in Library Tasks
	 *
	 * @since  1.0.0
	 */
	public function load_library(){
		$library = [];
		ob_start();
		foreach( glob( Core::$plugin_data['this-dir'] . 'library/*.txt' ) as $file ) {
          	array_push($library, file_get_contents($file));
        }
        foreach( glob( Core::$plugin_data['save-dir'] . '/*.txt' ) as $file ) {
            array_push($library, file_get_contents($file));
        }
		ob_flush();
        echo json_encode($library);
        wp_die();	
    }

    /**
     *  Creates a new Tasker record or replaces an exisitng in the database
     *
     * @since  1.0.0
     * @return string
     */
    public function save_tasker(){         
        ob_start();
            file_put_contents ( Core::$plugin_data["save-dir"]."/".$_POST['data']['name'].".txt", $_POST['data']['file']);
        ob_flush();
        wp_die();
    }

    /**
     *  Creates a new Tasker record or replaces an exisitng in the database
     *
     * @since  1.0.0
     * @return string
     */
    public function delete_tasker(){    
        unlink( Core::$plugin_data["save-dir"]."/".$_POST['name'].".txt" );
        wp_die();
    }

    /**
     *  Export Whole library and return download link
     *
     * @since  1.0.0
     * @return string
     */
    public function export_all_tasker(){
        $zip = new \ZipArchive;
        $ret = $zip->open(Core::$plugin_data['save-dir'] .'/tasker-library-packaged.zip', \ZipArchive::CREATE | \ZipArchive::OVERWRITE);
        if($ret === true){
            foreach( glob( Core::$plugin_data['save-dir'] . '/*.txt' ) as $file ) {
                $filePath = explode("/", $file);
                $zip->addFile($file, $filePath[count($filePath)-1]);
            }
            $zip->close();
            echo Core::$plugin_data['save-root'] . '/tasker-library-packaged.zip';
        }
        wp_die();
    }

    /**
     *  Import a single or multitude of taskers called directly on settings page (Must be .zip or .txt file)
     *
     * @since  1.0.0
     * @return string
     */
    public static function import_all_tasker(){

        $uploadfiles = $_FILES['tasker_uploads'];
        if (is_array($uploadfiles)) {
            foreach ($uploadfiles['name'] as $key => $value) {
                $name = $uploadfiles['name'][$key];
                $tmp = $uploadfiles['tmp_name'][$key];
                $finalFolder = Core::$plugin_data["save-dir"] . "/" . basename($name);
                if (strpos($finalFolder, '.zip') !== false) {
                    move_uploaded_file($tmp, $finalFolder);
                    $zip = new \ZipArchive;
                    if ($zip->open($finalFolder) === TRUE) {
                        $zip->extractTo(Core::$plugin_data["save-dir"] . "/");
                        $zip->close();
                    }
                    unlink($finalFolder);
                }
                elseif(strpos($finalFolder, '.txt') !== false){
                    move_uploaded_file($tmp, $finalFolder);
                }

            }
        }
    }

    /**
     * This function is used to recursively copy all the files in a folder and duplicate them. 
     * The arguments require a source folder and a destination folder path
     *
     * @param [type] $source
     * @param [type] $dest
     * 
     * @return void
     * 
     */
    public static function copy_recursive($source, $dest)
    {
        /* if destination is a directory then create it if it doesn't exist */
        if(!file_exists($dest)){
            mkdir($dest, 0755);
        }
        /* Loop through and copy files and create directories as needed */
        foreach (
        $iterator = new \RecursiveIteratorIterator(
        new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
        \RecursiveIteratorIterator::SELF_FIRST) as $item
        ) {
            if ($item->isDir()) {
                if(!file_exists($dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName())){
                    mkdir($dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName(), 0755);
                }
            } else {
                copy($item, $dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());     
            }
        }
    }

}

new base();