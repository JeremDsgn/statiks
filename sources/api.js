import React, {
  AlertIOS,
} from 'react-native';

import { diff } from './_utils/diff';
import { removeTag } from './_utils/utils';
import { extend, read } from './_utils/object';
import Storage from './_utils/storage';

// Can I move result obj into sumTotal function ?
let result = {};

function sumTotal(obj) {
  for (let key in obj) {
    if (result.hasOwnProperty(key)) result[key] += parseInt(obj[key], 10);
    else result[key] = parseInt(obj[key], 10);
  }

  return result;
}

export function fetchy(uri, username, network, details, current, sync) {
  const objNetwork = {};
  const objHistory = {};
  let timestampDiff = {};

  return fetch(uri).then((response) => {
    if (response.ok) {
      const _detail = details(response);
      const _total = {
        total: {
          stats: sumTotal(_detail.stats),
          user: "to create"
        }
      };

      objNetwork[network] = {
        data: _detail,
        history: read(current, 'history') || {}
      };

      if (read(current, 'data')) {
        const _diff = diff(current.data, _detail);

        timestampDiff[sync] = _diff;
        extend(objNetwork[network].history, timestampDiff);
        extend(objNetwork[network], objHistory);
      }

      extend(objNetwork, _total);
      Storage.actualize('userData', objNetwork);

      return 'success';
    } else if (response.status === 404) {
      AlertIOS.prompt(`${ username } not found.`, null, null, null, 'default');
    } else {
      const errorMessage = JSON.parse(response._bodyText).message;
      AlertIOS.prompt(`${ (errorMessage) ? errorMessage : 'Error scrappy scrapper.' }`, null, null, null, 'default');
    }
  }).catch((error) => {
    AlertIOS.prompt(`${ error.message }.`, null, null, null, 'default');
  });
}

export default api = {
  /**
  * Dribbble API connection
  */
  dribbble(network, username, current, sync) {
    const uri = `https://api.dribbble.com/v1/users/${ username }?access_token=419f6f1f2113f0328d44c3269232d69a9d55c87dd04c939b2ca9f3416dd89d2c`;

    function details(response) {
      const data = JSON.parse(response._bodyText);

      return details = {
        stats: {
          "Followers": data.followers_count,
          "Following": data.followings_count,
          "Likes": data.likes_count,
          "Likes received": data.likes_received_count,
          "Shots": data.shots_count,
          "Projects": data.projects_count,
        },
        user: {
          "Username": data.username,
          "Avatar": data.avatar_url,
          "Location": data.location,
          "Bio": removeTag(data.bio),
          "Name": data.name,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Twitter API connection
  */
  twitter(network, username, current, sync) {
    const uri = `https://twitter.com/${ username }`;

    function details(response) {
      const data = (response._bodyText).replace(/&quot;/g, '"');

      return details = {
        stats: {
          "Followers": parseInt((/\"followers_count\":([\d]+)/g).exec(data)[1]),
          "Following": parseInt((/\"friends_count\":([\d]+)/g).exec(data)[1]),
          "Tweets": parseInt((/\"statuses_count\":([\d]+)/g).exec(data)[1]),
          "Favorites": parseInt((/\"favourites_count\":([\d]+)/g).exec(data)[1]),
          "Listed": parseInt((/\"listed_count\":([\d]+)/g).exec(data)[1]),
        },
        user: {
          "Username": username,
          "Avatar": (((/\"profile_image_url\":"(.*?)"/g).exec(data)[1]).replace(/\\/g, '')).replace(/_normal/g, ''),
          "Location": (/\"location\":"(.*?)"/g).exec(data)[1],
          "Bio": ((/\"description\":"(.*?)"/g).exec(data)[1]).replace(/\\n/g, ' ').replace(/\\/g, ''),
          "Name": ((/\"name\":"(.*?)"/g).exec(data)[1]).replace(/\\/g, ''),
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Facebook API connection
  * TODO
  *
  facebook() {

  },

  /**
  * Behance API connection
  */
  behance(network, username, current, sync) {
    const uri = `https://www.behance.net/v2/users/${ username }?api_key=pEb2TjTxS31kT7fv2TPma6WK8WF8Mlgf`;

    function details(response) {
      const data = JSON.parse(response._bodyText).user;

      return details = {
        stats: {
          "Followers": data.stats.followers,
          "Following": data.stats.following,
          "Likes": data.stats.appreciations,
          "Comments": data.stats.comments,
          "Views": data.stats.views,
        },
        user: {
          "Username": data.username,
          "Avatar": data.images['230'],
          "Location": data.location,
          "Bio": data.sections.About,
          "Name": data.display_name,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * 500px API connection
  */
  fivehundredpx(network, username, current, sync) {
    const uri = `https://api.500px.com/v1/users/show?username=${ username }&consumer_key=GKHCkl4MdEE2rCFLVeIOWbYxhgk06s69xKnUzad3`;

    function details(response) {
      const data = JSON.parse(response._bodyText).user;

      return details = {
        stats: {
          "Followers": data.followers_count,
          "Following": data.friends_count,
          "Affection": data.affection,
          "Favorites": data.in_favorites_count,
          "Photos": data.photos_count,
        },
        user: {
          "Username": data.username,
          "Avatar": data.userpic_url,
          "City": data.city,
          "Country": data.country,
          "Bio": data.about,
          "Name": data.fullname,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * GitHub API connection
  */
  github(network, username, current, sync) {
    const uri = `https://api.github.com/users/${ username }`;

    function details(response) {
      const data = JSON.parse(response._bodyText);

      return details = {
        stats: {
          "Followers": data.followers,
          "Following": data.following,
          "Repository": data.public_repos,
          "Gist": data.public_gists,
        },
        user: {
          "Username": data.login,
          "Avatar": data.avatar_url,
          "Location": data.location,
          "Bio": data.bio,
          "Name": data.name,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Vimeo API connection
  */
  vimeo(network, username, current, sync) {
    const uri = `http://vimeo.com/api/v2/${ username }/info.json`;

    function details(response) {
      const data = JSON.parse(response._bodyText);

      return details = {
        stats: {
          "Followers": data.total_contacts,
          // "Following": data.following,
          "Videos": data.total_videos_uploaded,
          "Channels": data.total_channels,
          "Likes": data.total_videos_liked,
          "Albums": data.total_albums,
        },
        user: {
          "Username": username,
          "Avatar": data.portrait_huge,
          "Location": data.location,
          "Bio": data.bio,
          "Name": data.display_name,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Instagram API connection
  */
  instagram(network, username, current, sync) {
    const uri = `http://instagram.com/${ username }`;

    function details(response) {
      const data = (response._bodyText).replace(/\\/g, '');

      return details = {
        stats: {
          "Followers": parseInt((/\"followed_by\":{\"count\":([\d]+)/g).exec(data)[1]),
          "Following": parseInt((/\"follows\":{\"count\":([\d]+)/g).exec(data)[1]),
          "Medias": parseInt((/\"media\":{\"count\":([\d]+)/g).exec(data)[1]),
        },
        user: {
          "Username": username,
          "Avatar": (/\"profile_pic_url\":"(.*?)"/g).exec(data)[1],
          "Bio": (/\"biography\":"(.*?)"/g).exec(data)[1],
          "Name": (/\"full_name\":"(.*?)"/g).exec(data)[1],
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Pinterest API connection
  */
  pinterest(network, username, current, sync) {
    const uri = `https://pinterest.com/${ username }`;

    function details(response) {
      const data = response._bodyText;

      return details = {
        stats: {
          "Followers": (/followers" content="([\d]+)"/g).exec(data)[1],
          "Following": (/following" content="([\d]+)"/g).exec(data)[1],
          "Pins": (/pins" content="([\d]+)"/g).exec(data)[1],
          "Boards": (/boards" content="([\d]+)"/g).exec(data)[1],
        },
        user: {
          "Username": username,
          "Avatar": (/image:src" content="(.*?)"/g).exec(data)[1],
          "Bio": (/about" content="(.*?)"/g).exec(data)[1],
          "Name": ((/og:title" content="(.*?)"/g).exec(data)[1]).replace(/\s*\(.*?\)\s*/g, ''),
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Youtube API connection
  * TODO
  *
  youtube() {

  },

  /**
  * Soundcloud API connection
  */
  soundcloud(network, username, current, sync) {
    const uri = `http://api.soundcloud.com/users/${ username }.json?client_id=6ff9d7c484c5e5d5517d1965ca18eca9`;

    function details(response) {
      const data = JSON.parse(response._bodyText);

      return details = {
        stats: {
          "Followers": data.followers_count,
          "Following": data.followings_count,
          "Tracks": data.track_count,
          "Playlist": data.playlist_count,
          "Favorites": data.public_favorites_count,
        },
        user: {
          "Username": data.username,
          "Avatar": data.avatar_url,
          "City": data.city,
          "Country": data.country,
          "Bio": data.description,
          "Name": data.full_name,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },

  /**
  * Deviantart API connection
  * TODO
  *
  deviantart() {

  },

  /**
  * Product Hunt API connection
  */
  producthunt(network, username, current, sync) {
    const uri = `https://api.producthunt.com/v1/users/${ username }?access_token=4671783399e1265f34e04e335283fefe896bec9e3a5a7f89f41080adf155c034`;

    function details(response) {
      const data = JSON.parse(response._bodyText).user;

      return details = {
        stats: {
          "Followers": data.followers_count,
          "Following": data.followings_count,
          "Votes": data.votes_count,
          "Posts": data.posts_count,
          "Maker": data.maker_of_count,
          "Collections": data.collections_count,
        },
        user: {
          "Username": username,
          "Avatar": data.image_url['220px'],
          "Bio": data.headline,
          "Name": data.name,
        }
      }
    }

    return fetchy(uri, username, network, details, current, sync);
  },
}