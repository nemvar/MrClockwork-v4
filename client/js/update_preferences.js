
var lastSelectedGameName;

/** See docs @ https://developer.snapappointments.com/bootstrap-select/options/#events */
/** Triggers when another game is selected and displays the current preferences
 *  for that game, while hiding the previous one's so as to not overlap.
 */
$("#input_game").on("changed.bs.select", function(e, clickedIndex, isSelected, oldValue)
{
    const gameName = $(this).find("option").eq(clickedIndex).val();

    $(`#${lastSelectedGameName}_container`).hide();
    $(`#${gameName}_container`).show();

    console.log(`Switching to ${gameName} from ${lastSelectedGameName}`);
    lastSelectedGameName = gameName;

});