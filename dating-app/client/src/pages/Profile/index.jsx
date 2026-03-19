import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Profile from "../../components/instagram/Profile";
import { fetchProfile } from "../../redux/slices/userSlice";
import { demoUser } from "../../utils/mockData";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.user.profile);
  const user = profile || authUser || demoUser;
  const resolvedUsername = username || user?.username || demoUser.username;
  const isOwnProfile = !username || username === authUser?.username;

  useEffect(() => {
    dispatch(fetchProfile(resolvedUsername));
  }, [dispatch, resolvedUsername]);

  return (
    <Profile
      user={user}
      resolvedUsername={resolvedUsername}
      isOwnProfile={isOwnProfile}
    />
  );
};

export default ProfilePage;
