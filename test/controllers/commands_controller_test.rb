require "test_helper"

class CommandsControllerTest < ActionDispatch::IntegrationTest
  test "should get hadouken" do
    get commands_hadouken_url
    assert_response :success
  end
end
